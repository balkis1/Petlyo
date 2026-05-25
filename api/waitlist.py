import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler
import httpx
import os

SUPABASE_URL = os.getenv('SUPABASE_URL', '')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY', '')
BASE_COUNT   = 47


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_GET(self):
        if not SUPABASE_URL:
            self._respond(200, {'total': BASE_COUNT})
            return
        try:
            r = httpx.get(
                f'{SUPABASE_URL}/rest/v1/waitlist?select=id',
                headers={
                    'apikey': SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}',
                },
                timeout=5,
            )
            total = len(r.json()) + BASE_COUNT
            self._respond(200, {'total': total})
        except Exception:
            self._respond(200, {'total': BASE_COUNT})

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = json.loads(self.rfile.read(length))
        email  = body.get('email', '').strip()

        if not email:
            self._respond(400, {'error': 'email required'})
            return

        if not SUPABASE_URL:
            self._respond(200, {'status': 'received', 'total': BASE_COUNT})
            return

        try:
            # Check for duplicate
            check = httpx.get(
                f'{SUPABASE_URL}/rest/v1/waitlist?email=eq.{email}&select=id',
                headers={
                    'apikey': SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}',
                },
                timeout=5,
            )
            if check.json():
                count_r = httpx.get(
                    f'{SUPABASE_URL}/rest/v1/waitlist?select=id',
                    headers={'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'},
                    timeout=5,
                )
                self._respond(200, {'status': 'already_on_list', 'total': len(count_r.json()) + BASE_COUNT})
                return

            httpx.post(
                f'{SUPABASE_URL}/rest/v1/waitlist',
                headers={
                    'apikey':        SUPABASE_KEY,
                    'Authorization': f'Bearer {SUPABASE_KEY}',
                    'Content-Type':  'application/json',
                    'Prefer':        'return=minimal',
                },
                json={'email': email, 'joined_at': datetime.now(timezone.utc).isoformat()},
                timeout=5,
            )

            count_r = httpx.get(
                f'{SUPABASE_URL}/rest/v1/waitlist?select=id',
                headers={'apikey': SUPABASE_KEY, 'Authorization': f'Bearer {SUPABASE_KEY}'},
                timeout=5,
            )
            self._respond(200, {'status': 'added', 'total': len(count_r.json()) + BASE_COUNT})
        except Exception as exc:
            self._respond(500, {'error': str(exc)})

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
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
