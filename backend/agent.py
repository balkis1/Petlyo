import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

load_dotenv()


def get_llm():
    groq_key = os.getenv("GROQ_API_KEY", "").strip()
    if groq_key:
        from langchain_groq import ChatGroq
        return ChatGroq(
            model="llama-3.3-70b-versatile",
            api_key=groq_key,
            temperature=0.7,
            max_tokens=300,
        )
    try:
        import httpx
        r = httpx.get("http://localhost:11434/api/tags", timeout=2.0)
        if r.status_code == 200:
            models = r.json().get("models", [])
            if models:
                from langchain_ollama import ChatOllama
                return ChatOllama(model=models[0]["name"], temperature=0.7)
    except Exception:
        pass
    raise RuntimeError(
        "No LLM configured. Add GROQ_API_KEY to backend/.env "
        "(free key at https://console.groq.com/keys)"
    )


def _format_pet(pet: dict) -> str:
    if not pet or not pet.get("petName"):
        return ""
    traits = ", ".join(pet.get("traits", [])) or "none listed"
    env    = ", ".join(pet.get("environment", [])) or "none listed"
    return (
        f"Pet name: {pet['petName']} | Species: {pet.get('species','?')} | "
        f"Breed: {pet.get('breed','?')} | Age: {pet.get('age','?')} | "
        f"City: {pet.get('city','?')} | Traits: {traits} | "
        f"Environment needs: {env} | Feeding: {pet.get('feedingSchedule','?')} | "
        f"Exercise: {pet.get('exercise','?')} | Medication: {pet.get('medication','none')} | "
        f"Notes: {pet.get('extraNotes','none')}"
    )


def _format_sitters(sitters: list) -> str:
    if not sitters:
        return ""
    lines = []
    for i, s in enumerate(sitters, 1):
        bd = s.get("breakdown", {})
        lines.append(
            f"#{i} {s['name']} — {s.get('matchScore','?')}% match | "
            f"{s.get('yearsExperience','?')} yrs exp | ★{s.get('rating','?')} "
            f"({s.get('numberOfStays','?')} stays) | "
            f"{'Home all day' if s.get('homeAllDay') else 'Part-time home'} | "
            f"Home type: {s.get('environmentType','?')} | "
            f"Other pets: {s.get('otherPets','?')} | "
            f"Specialties: {', '.join(s.get('specialties',[]))} | "
            f"Why matched: {s.get('matchReason','?')} | "
            f"Scores — env:{bd.get('environment','?')}% energy:{bd.get('energy','?')}% "
            f"routine:{bd.get('routine','?')}% experience:{bd.get('experience','?')}%"
        )
    return "\n".join(lines)


def build_system_prompt(pet_data: dict, sitters: list) -> str:
    base = (
        "You are Petlyo AI, a warm and knowledgeable pet care assistant for the Petlyo platform. "
        "Petlyo matches pet owners with the perfect sitter based on their pet's personality and needs. "
        "Be conversational, friendly, and concise — 2 to 4 sentences max. "
        "Answer any pet-care question from your own knowledge. "
        "When the user asks about their specific sitters or pet, use the context below."
    )

    pet_str    = _format_pet(pet_data)
    sitter_str = _format_sitters(sitters)

    if pet_str or sitter_str:
        base += "\n\n--- USER CONTEXT ---"
    if pet_str:
        base += f"\nPet profile: {pet_str}"
    if sitter_str:
        base += f"\nMatched sitters:\n{sitter_str}"

    return base


def format_history(raw: list) -> list:
    msgs = []
    for m in raw:
        role = m.get("role", "")
        if role == "user":
            msgs.append(HumanMessage(content=m["content"]))
        elif role == "assistant":
            msgs.append(AIMessage(content=m["content"]))
    return msgs


def run_agent(pet_data: dict, sitters: list, message: str, history: list) -> str:
    llm = get_llm()
    system = build_system_prompt(pet_data, sitters)
    messages = [SystemMessage(content=system)] + history + [HumanMessage(content=message)]
    response = llm.invoke(messages)
    return response.content.strip()
