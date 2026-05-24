import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mangum import Mangum
from agent import run_agent, format_history

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class ChatRequest(BaseModel):
    message: str
    history: list = []
    pet_data: dict = {}
    sitters: list = []


@app.get("/health")
@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
@app.post("/api/chat")
async def chat(req: ChatRequest):
    try:
        history = format_history(req.history[-10:])
        reply = await asyncio.to_thread(
            run_agent, req.pet_data, req.sitters, req.message, history
        )
        return {"reply": reply}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")


handler = Mangum(app)
