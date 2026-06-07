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

        pet_name    = body.get('petName', 'Your pet')
        species     = body.get('species', 'pet')
        traits      = body.get('traits', [])
        eating      = body.get('eating', 'normally')
        energy      = body.get('energy', 'normal')
        location    = body.get('location', 'resting calmly')
        sounds      = body.get('sounds', 'quiet')
        posture     = body.get('posture', 'relaxed')

        trait_str = ', '.join(traits) if traits else 'no specific traits noted'

        prompt = f"""You are an expert animal behaviorist providing a pet wellness check-in report.

Pet details:
- Name: {pet_name}
- Species: {species}
- Known traits/personality: {trait_str}

Current behavioral observations from the sitter:
- Eating: {eating}
- Energy level: {energy}
- Where they are / hiding behavior: {location}
- Sounds they are making: {sounds}
- Body posture: {posture}

Write a warm, professional behavioral wellness report for the pet owner. Structure it as:

1. A MOOD SCORE from 0-100 (just the number, on its own line, prefixed with "SCORE:")
2. A STATUS label: one of "Thriving", "Content", "Unsettled", or "Needs Attention" (prefixed with "STATUS:")
3. A 2-3 sentence behavioral assessment written warmly and personally using the pet's name
4. 1-2 specific, actionable recommendations for the sitter

Keep the tone warm, reassuring when appropriate, and honest when concerns exist. Do not be overly alarming. Use the pet's name throughout."""

        groq_key = os.getenv('GROQ_API_KEY', '').strip()
        if not groq_key:
            self._respond(500, {'error': 'GROQ_API_KEY not configured'})
            return

        payload = json.dumps({
            'model': GROQ_MODEL,
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': 0.7,
            'max_tokens': 400
        }).encode()

        req = urllib.request.Request(
            GROQ_URL,
            data=payload,
            headers={
                'Authorization': f'Bearer {groq_key}',
                'Content-Type': 'application/json'
            }
        )

        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                result = json.loads(r.read())
                text   = result['choices'][0]['message']['content'].strip()

                score  = 72
                status = 'Content'
                for line in text.splitlines():
                    if line.startswith('SCORE:'):
                        try: score = int(line.replace('SCORE:', '').strip())
                        except: pass
                    if line.startswith('STATUS:'):
                        status = line.replace('STATUS:', '').strip()

                lines = [l for l in text.splitlines() if not l.startswith('SCORE:') and not l.startswith('STATUS:') and l.strip()]
                report = '\n'.join(lines).strip()

                self._respond(200, {'score': score, 'status': status, 'report': report})
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
