import os, json, urllib.request, urllib.error
from http.server import BaseHTTPRequestHandler

GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions'
GROQ_MODEL = 'llama-3.3-70b-versatile'

class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = json.loads(self.rfile.read(length))

        p = body.get('petData', {})
        name     = p.get('petName', 'Your pet')
        species  = p.get('species', 'pet')
        breed    = p.get('breed', '')
        age      = p.get('age', '')
        traits   = p.get('traits', [])
        env      = p.get('environment', [])
        feeding  = p.get('feedingSchedule', '')
        exercise = p.get('exercise', '')
        meds     = p.get('medication', '')
        notes    = p.get('extraNotes', '')
        city     = p.get('city', '')

        trait_str = ', '.join(traits) if traits else 'balanced, adaptable'
        env_str   = ', '.join(env)   if env   else 'standard home environment'

        prompt = f"""You are writing a professional, warm pet care guide for a sitter. Generate a complete care guide for this pet.

Pet details:
- Name: {name}
- Species: {species}
- Breed: {breed or 'not specified'}
- Age: {age or 'not specified'}
- Personality traits: {trait_str}
- Environment needs: {env_str}
- Feeding schedule: {feeding or 'not specified'}
- Exercise needs: {exercise or 'not specified'}
- Medications: {meds or 'none'}
- Extra notes from owner: {notes or 'none'}
- Location: {city or 'not specified'}

Write a care guide with EXACTLY these sections, each on its own line with the section header in ALL CAPS followed by a colon:

PERSONALITY:
[2 sentences describing the pet's personality warmly and specifically, using their name]

FEEDING:
[Specific feeding instructions — times, amounts, food type. If not provided, give sensible defaults for this species/age]

DAILY ROUTINE:
[What a typical day looks like — morning, afternoon, evening. Exercise, playtime, rest]

STRESS SIGNALS:
[How to know when {name} is anxious or uncomfortable, and exactly what to do]

COMFORT & SAFETY:
[Their favourite spots, comfort items, what makes them feel safe, what to avoid]

MEDICATIONS:
[Medication instructions if any, or write "No medications required"]

EMERGENCY:
[What to do in an emergency — signs to watch for, when to call the owner immediately]

OWNER'S NOTE:
[A warm closing note from the owner's perspective to the sitter, using {name}'s name]

Keep each section concise — 2-4 sentences. Write warmly and professionally. Use {name}'s name throughout."""

        groq_key = os.getenv('GROQ_API_KEY', '').strip()
        if not groq_key:
            self._respond(500, {'error': 'GROQ_API_KEY not configured'})
            return

        payload = json.dumps({
            'model': GROQ_MODEL,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': 0.7,
            'max_tokens': 800
        }).encode()

        req = urllib.request.Request(
            GROQ_URL, data=payload,
            headers={'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                result = json.loads(r.read())
                text   = result['choices'][0]['message']['content'].strip()
                self._respond(200, {'guide': text, 'petName': name, 'species': species})
        except urllib.error.HTTPError as e:
            self._respond(500, {'error': f'Groq error: {e.code}'})
        except Exception as e:
            self._respond(500, {'error': str(e)})

    def _respond(self, code, data):
        payload = json.dumps(data).encode()
        self.send_response(code)
        self._cors()
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
