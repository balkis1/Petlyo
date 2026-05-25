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
