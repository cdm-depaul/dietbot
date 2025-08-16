from typing import Dict, Any, List, Optional
import logging

from .potts import IntentClassifier
from .local_model import LocalModel
from . import crud  # ⬅️ add this import

# 7/6/2025 set up the log message file
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

# 7/6/2025 nt: classifier is created inside LocalModel
# classifier = IntentClassifier()
model = LocalModel()

async def get_chat_response_from_query(user_context: Dict[str, Any], query: str) -> str:
    """
    Processes the user query using intent classification and a language model,
    incorporating user context and short-term chat memory.
    """
    # 7/4/2025 nt changed (to align with change in the DM schema)
    # user_id = user_context.get('profile', {}).get('id', 'Unknown')
    profile = user_context.get("profile", {}) or {}
    user_id = profile.get("user_id", "Unknown")
    logger.info(f"Processing query: '{query}' for user ID: {user_id}")

    # ---------- 1) Pull recent chat memory ----------
    history: List[dict] = []
    try:
        if isinstance(user_id, int):
            history = crud.get_chat_history(user_id=user_id, limit=12)  # newest-first
    except Exception as e:
        logger.warning(f"Could not fetch chat history for user {user_id}: {e}")

    # Inject history into a copy of the context
    ctx_with_history = dict(user_context)
    ctx_with_history["history"] = history

    # ---------- 2) Generate response ----------
    try:
        logger.info("Generating response with the model...")
        response_dict = model.get_response(query=query, user_context=ctx_with_history)
        response_text: str = response_dict.get("final_answer", "Sorry, I could not generate a response.")

        logger.info("** Response Dict **")
        logger.info(response_dict)
        print(f"**** Response Dict ****\n{response_dict}")

    except Exception as e:
        logger.error(f"Error processing chat query for user {user_id}: {e}", exc_info=True)
        return "Sorry, I encountered an error. Please try again."

    # ---------- 3) Persist this turn to chat_history ----------
    try:
        if isinstance(user_id, int):
            # user message
            crud.append_chat_turn(user_id=user_id, sender="user", message=query)
            # assistant message
            crud.append_chat_turn(user_id=user_id, sender="assistant", message=response_text)
    except Exception as e:
        logger.warning(f"Failed to append chat turn(s) for user {user_id}: {e}")

    return response_text