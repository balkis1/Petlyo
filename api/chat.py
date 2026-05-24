import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

import json
from http.server import BaseHTTPRequestHandler
from agent import run_agent, format_history


class handler(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body   = json.loads(self.rfile.read(length))

        try:
            history = format_history(body.get('history', [])[-10:])
            reply   = run_agent(
                body.get('pet_data', {}),
                body.get('sitters', []),
                body.get('message', ''),
                history,
            )
            self._respond(200, {'reply': reply})
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
