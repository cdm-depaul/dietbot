from typing import Dict, Any
import logging

from .potts import IntentClassifier
from .local_model import LocalModel 
# from .model import Model

## 7/6/2025 set up the log message file
logging.basicConfig(level=logging.DEBUG, 
		    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)

## 7/6/2025 nt: classifier is created inside LocalModel
#classifier = IntentClassifier()
model = LocalModel()

async def get_chat_response_from_query(user_context: Dict[str, Any], query: str) -> str:
    """
    Processes the user query using intent classification and a language model,
    incorporating user context.
    """
    ## 7/4/2025 nt changed (to aligh with the change in the DM schema)
    #user_id = user_context.get('profile', {}).get('id', 'Unknown')
    user_id = user_context.get('profile', {}).get('user_id', 'Unknown')
    logger.info(f"Processing query: '{query}' for user ID: {user_id}")

    try:
        # Generate response 
        logger.info("Generating response with the model...")
        response_dict = model.get_response(query=query, user_context=user_context) 
        response_text = response_dict.get("final_answer", "Sorry, I could not generate a response.")
        
        logger.info(f"Generated response for user {user_id}: '{response_text[:100]}...'" ) # Log truncated response
        return response_text

    except Exception as e:
        logger.error(f"Error processing chat query for user {user_id}: {e}", exc_info=True)
        return "Sorry, I encountered an error. Please try again."


