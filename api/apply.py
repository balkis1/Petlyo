import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
import httpx

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', '')


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = json.loads(self.rfile.read(length))

        row = {
            'name':         body.get('name', ''),
            'city':         body.get('city', ''),
            'experience':   body.get('experience', ''),
            'home_type':    body.get('homeType', ''),
            'rate_per_day': body.get('ratePerDay', ''),
            'presence':     body.get('presence', ''),
            'availability': body.get('availability', []),
            'specialties':  body.get('specialties', []),
            'bio':          body.get('bio', ''),
            'email':        body.get('email', ''),
            'phone':        body.get('phone', ''),
            'submitted_at': datetime.now(timezone.utc).isoformat(),
        }

        try:
            r = httpx.post(
                f'{SUPABASE_URL}/rest/v1/sitter_applications',
                headers={
                    'apikey':        SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}',
                    'Content-Type':  'application/json',
                    'Prefer':        'return=minimal',
                },
                json=row,
                timeout=10,
            )
            self._respond(200, {'status': 'received'})
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
