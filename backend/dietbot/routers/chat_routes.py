from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any, List
from pydantic import BaseModel

from .. import crud, schemas
try:
    from .. import services
except ImportError:
    class DummyService:
        async def get_chat_response_from_query(self, user_context: Dict[str, Any], query: str) -> str:
            print("WARN: services.py not found or get_chat_response_from_query not defined. Using dummy response.")
            return f"Placeholder response: Received query '{query}'. Integrate actual chat logic."
    services = DummyService()

router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)

# --------- Local schema just for appending a turn (no created_at needed) ----------
class ChatTurnCreate(BaseModel):
    sender: str   # "user" | "assistant"
    message: str

# --- NEW: get recent chat history (newest first) -------------------
@router.get("/{user_id}/recent", response_model=List[schemas.ChatTurn])
def get_recent_chat(user_id: int, limit: int = 12):
    rows = crud.get_recent_chat_history(user_id=user_id, limit=limit)
    return [
        schemas.ChatTurn(sender=r["sender"], message=r["message"], created_at=r["created_at"])
        for r in rows
    ]

# --- NEW: append a single turn to history --------------------------
@router.post("/{user_id}/append", status_code=status.HTTP_201_CREATED)
def append_chat_turn(user_id: int, turn: ChatTurnCreate):
    if turn.sender not in {"user", "assistant"}:
        raise HTTPException(status_code=400, detail="sender must be 'user' or 'assistant'")
    created = crud.append_chat_turn(user_id=user_id, sender=turn.sender, message=turn.message)
    if not created:
        raise HTTPException(status_code=500, detail="Failed to append chat turn")
    return {"ok": True}

# --- EXISTING: ask endpoint (now also persists both sides + sends history) ---------
@router.post("/{user_id}/ask", response_model=schemas.ChatResponse)
async def ask_chat(
    user_id: int,
    chat_query: schemas.ChatQuery,
):
    # 1) profile
    user_profile_dict = crud.get_user_profile(user_id=user_id)
    if user_profile_dict is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # 2) recent intake
    recent_intake_list = crud.get_recent_nutrient_intake(user_id=user_id, limit=5)

    # 3) base context
    user_context: Dict[str, Any] = {
        "profile": user_profile_dict,
        "recent_intake": recent_intake_list,
    }

    # 4) persist user's message
    crud.append_chat_turn(user_id=user_id, sender="user", message=chat_query.query)

    # 4.5) fetch recent turns (now includes the message we just saved)
    recent_turns = crud.get_recent_chat_history(user_id=user_id, limit=10)  # newest first
    # LLMs expect oldest -> newest; reverse them
    history_messages = [
        {"role": r["sender"], "content": r["message"]}
        for r in reversed(recent_turns)
    ]
    user_context["chat_history"] = history_messages

    # 5) call chat service
    try:
        response_text = await services.get_chat_response_from_query(user_context, chat_query.query)
    except Exception as e:
        print(f"Error calling chat service: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing chat query")

    # 6) persist assistant response
    crud.append_chat_turn(user_id=user_id, sender="assistant", message=response_text)

    # 7) return
    return schemas.ChatResponse(response=response_text)