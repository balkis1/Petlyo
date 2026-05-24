import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request

class StripApiPrefix(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.scope.get('path', '')
        if path.startswith('/api'):
            request.scope['path'] = path[4:] or '/'
        return await call_next(request)

app.add_middleware(StripApiPrefix)
