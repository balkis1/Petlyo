import asyncio
import json
import os
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from agent import run_agent, format_history

APPLICATIONS_FILE = os.path.join(os.path.dirname(__file__), 'applications.json')
WAITLIST_FILE     = os.path.join(os.path.dirname(__file__), 'waitlist.json')

app = FastAPI(title="Petlyo AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: list = []
    pet_data: dict = {}
    sitters: list = []

class WaitlistEntry(BaseModel):
    email: str

class SitterApplication(BaseModel):
    name: str
    city: str
    experience: str
    homeType: str
    ratePerDay: str = ''
    presence: str = ''
    availability: list = []
    specialties: list = []
    bio: str = ''
    email: str
    phone: str = ''


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/waitlist")
def join_waitlist(entry: WaitlistEntry):
    waitlist = []
    if os.path.exists(WAITLIST_FILE):
        with open(WAITLIST_FILE, 'r') as f:
            waitlist = json.load(f)
    emails = [w['email'] for w in waitlist]
    if entry.email in emails:
        return {"status": "already_on_list", "total": len(waitlist)}
    waitlist.append({"email": entry.email, "joinedAt": datetime.now().isoformat()})
    with open(WAITLIST_FILE, 'w') as f:
        json.dump(waitlist, f, indent=2)
    return {"status": "added", "total": len(waitlist)}

@app.get("/waitlist/count")
def waitlist_count():
    if not os.path.exists(WAITLIST_FILE):
        return {"total": 47}
    with open(WAITLIST_FILE, 'r') as f:
        return {"total": len(json.load(f)) + 47}


@app.post("/apply")
def apply(app_data: SitterApplication):
    entry = app_data.dict()
    entry["submittedAt"] = datetime.now().isoformat()

    applications = []
    if os.path.exists(APPLICATIONS_FILE):
        with open(APPLICATIONS_FILE, 'r') as f:
            applications = json.load(f)

    applications.append(entry)

    with open(APPLICATIONS_FILE, 'w') as f:
        json.dump(applications, f, indent=2, ensure_ascii=False)

    return {"status": "received", "total": len(applications)}


@app.get("/applications")
def get_applications():
    if not os.path.exists(APPLICATIONS_FILE):
        return []
    with open(APPLICATIONS_FILE, 'r') as f:
        return json.load(f)


class BehaviorRequest(BaseModel):
    petName: str = 'Your pet'
    species: str = 'pet'
    traits: list = []
    eating: str = 'eating normally'
    energy: str = 'normal energy level'
    location: str = 'resting calmly'
    sounds: str = 'quiet or purring'
    posture: str = 'relaxed and loose body posture'

@app.post("/behavior")
def behavior_checkin(req: BehaviorRequest):
    import urllib.request, urllib.error
    groq_key = os.getenv('GROQ_API_KEY', '').strip()
    if not groq_key:
        raise HTTPException(status_code=500, detail='GROQ_API_KEY not set')

    trait_str = ', '.join(req.traits) if req.traits else 'no specific traits noted'
    prompt = f"""You are an expert animal behaviorist providing a pet wellness check-in report.

Pet details:
- Name: {req.petName}
- Species: {req.species}
- Known traits/personality: {trait_str}

Current behavioral observations from the sitter:
- Eating: {req.eating}
- Energy level: {req.energy}
- Where they are / hiding behavior: {req.location}
- Sounds they are making: {req.sounds}
- Body posture: {req.posture}

Write a warm, professional behavioral wellness report for the pet owner. Structure it as:

1. A MOOD SCORE from 0-100 (just the number, on its own line, prefixed with "SCORE:")
2. A STATUS label: one of "Thriving", "Content", "Unsettled", or "Needs Attention" (prefixed with "STATUS:")
3. A 2-3 sentence behavioral assessment written warmly and personally using the pet's name
4. 1-2 specific, actionable recommendations for the sitter

Keep the tone warm, reassuring when appropriate, and honest when concerns exist. Use the pet's name throughout."""

    payload = json.dumps({
        'model': 'llama3-70b-8192',
        'messages': [{'role': 'user', 'content': prompt}],
        'temperature': 0.7,
        'max_tokens': 400
    }).encode()

    req2 = urllib.request.Request(
        'https://api.groq.com/openai/v1/chat/completions',
        data=payload,
        headers={'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req2, timeout=20) as r:
        result = json.loads(r.read())
        text = result['choices'][0]['message']['content'].strip()

    score = 72; status = 'Content'
    for line in text.splitlines():
        if line.startswith('SCORE:'):
            try: score = int(line.replace('SCORE:', '').strip())
            except: pass
        if line.startswith('STATUS:'):
            status = line.replace('STATUS:', '').strip()
    lines = [l for l in text.splitlines() if not l.startswith('SCORE:') and not l.startswith('STATUS:') and l.strip()]
    return {'score': score, 'status': status, 'report': '\n'.join(lines).strip()}


@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        history = format_history(req.history[-10:])
        reply   = await asyncio.to_thread(
            run_agent, req.pet_data, req.sitters, req.message, history
        )
        return {"reply": reply}

    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
