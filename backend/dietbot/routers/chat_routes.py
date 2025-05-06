from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

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

@router.post("/{user_id}/ask", response_model=schemas.ChatResponse)
async def ask_chat(
    user_id: int,
    chat_query: schemas.ChatQuery,
):
    # 1. Get user profile u
    user_profile_dict = crud.get_user_profile(user_id=user_id)
    if user_profile_dict is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    # 2. Get recent nutrient intake u
    recent_intake_list = crud.get_recent_nutrient_intake(user_id=user_id, limit=5)

    # 3. Format user context 
    user_context = {
        "profile": user_profile_dict,
        "recent_intake": recent_intake_list 
    }

    # 4. Call the backend function
    try:
        response_text = await services.get_chat_response_from_query(user_context, chat_query.query)
        return schemas.ChatResponse(response=response_text)
    except Exception as e:
        print(f"Error calling chat service: {e}") 
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error processing chat query")
