from langchain_core.tools import tool
from typing import List


def make_tools(pet_data: dict, sitters: List[dict]):

    @tool
    def lookup_sitter(name: str) -> str:
        """Look up full details about a matched sitter by first or full name."""
        found = next((s for s in sitters if name.lower() in s.get("name", "").lower()), None)
        if not found:
            names = [s["name"] for s in sitters]
            return f"No sitter named '{name}' found. Available: {', '.join(names)}"
        bd = found.get("breakdown", {})
        return (
            f"{found['name']}: {found['yearsExperience']} yrs experience, "
            f"★{found['rating']} rating from {found['numberOfStays']} stays, "
            f"{'home all day' if found['homeAllDay'] else 'part-time home'}, "
            f"home type: {found['environmentType']}, "
            f"other pets: {found['otherPets']}, "
            f"specialties: {', '.join(found['specialties'])}. "
            f"Match score: {found.get('matchScore', '?')}%. "
            f"Compatibility — environment fit: {bd.get('environment', '?')}%, "
            f"energy match: {bd.get('energy', '?')}%, "
            f"routine alignment: {bd.get('routine', '?')}%, "
            f"experience with type: {bd.get('experience', '?')}%. "
            f"Why they match: {found.get('matchReason', 'N/A')}"
        )

    @tool
    def compare_sitters(sitter1_name: str, sitter2_name: str) -> str:
        """Compare two matched sitters side by side for the current pet."""
        def find(name):
            return next((s for s in sitters if name.lower() in s.get("name", "").lower()), None)

        a, b = find(sitter1_name), find(sitter2_name)
        if not a:
            return f"Sitter '{sitter1_name}' not found in matches."
        if not b:
            return f"Sitter '{sitter2_name}' not found in matches."

        def row(s):
            return (
                f"{s['name']} ({s.get('matchScore', '?')}% match): "
                f"{s['yearsExperience']} yrs exp, "
                f"{'home all day' if s['homeAllDay'] else 'part-time'}, "
                f"{s['environmentType'].lower()}, "
                f"other pets: {s['otherPets']}, "
                f"specialties: {', '.join(s['specialties'])}"
            )

        return f"{row(a)}\n{row(b)}"

    @tool
    def list_all_matches() -> str:
        """List all matched sitters with their scores and match reasons."""
        if not sitters:
            return "No sitters matched yet. The user hasn't completed the matching flow."
        pet_name = pet_data.get("petName", "your pet")
        lines = [f"Top {len(sitters)} matches for {pet_name}:"]
        for i, s in enumerate(sitters, 1):
            lines.append(f"  #{i} {s['name']}: {s.get('matchScore', '?')}% — {s.get('matchReason', '')}")
        return "\n".join(lines)

    @tool
    def get_pet_profile() -> str:
        """Get the full profile of the owner's pet including traits, needs, and care schedule."""
        if not pet_data or not pet_data.get("petName"):
            return "No pet profile available yet. The user hasn't completed the matching flow."
        traits = ", ".join(pet_data.get("traits", [])) or "none specified"
        env    = ", ".join(pet_data.get("environment", [])) or "none specified"
        return (
            f"Pet: {pet_data['petName']} "
            f"({pet_data.get('species', 'unknown')}, "
            f"breed: {pet_data.get('breed', 'unknown')}, "
            f"age: {pet_data.get('age', 'unknown')}). "
            f"City: {pet_data.get('city', 'unknown')}. "
            f"Personality traits: {traits}. "
            f"Environment needs: {env}. "
            f"Feeding: {pet_data.get('feedingSchedule', 'N/A')}, "
            f"exercise: {pet_data.get('exercise', 'N/A')}, "
            f"medication: {pet_data.get('medication', 'none')}. "
            f"Extra notes: {pet_data.get('extraNotes', 'none')}."
        )

    return [lookup_sitter, compare_sitters, list_all_matches, get_pet_profile]
