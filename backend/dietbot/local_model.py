import json
import os
import logging
import requests
from dotenv import load_dotenv
from typing import List, Dict, Any

from .potts import IntentClassifier
from .retriever import Retriever
from .tools import meal_planning, meal_logging, personal_health_advice, educational_content

from google.auth.transport.requests import Request
from google.oauth2 import service_account
import google.auth
from google.auth import default

# Logging configuration
logger = logging.getLogger(__name__)

load_dotenv()

DEFAULT_MODEL = "dietbot"
AGENT_LOOP_LIMIT = 3
OLLAMA_API_URL = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/chat')

class LocalModel:
    MAX_HISTORY_TURNS = 10  # keep last N turns

    def __init__(self) -> None:
        try:
            self.intent_classifier = IntentClassifier()
            self.retriever = Retriever()
        except Exception as e:
            logger.error(f"Failed to initialize components (IntentClassifier/Retriever): {e}")
            raise
        
        self.model = os.getenv('OLLAMA_MODEL', DEFAULT_MODEL)
        self.agent_loop_limit = AGENT_LOOP_LIMIT

        self.system_prompt = (
            "You are an AI assistant whose primary goal is to answer user questions as accurately and effectively as possible. "
            "You are also a professional dietitian, with expert knowledge on food, nutrients and human health. "
            "Furthermore, you are a personal dietitian to the user.  Take every consideration of the user's biometric and dietary profile in responding. "
            "Also, respond in a gentle, kind, and empathetic tone. "
        )

    # --- Map DB chat history → chat messages expected by the model
    def _history_to_messages(self, history: List[Dict[str, Any]]) -> List[Dict[str, str]]:
        """
        Accepts newest-first rows shaped like: { sender, message, created_at }
        Converts to oldest-first and maps to [{role, content}] where role ∈ {'user','assistant'}.
        """
        if not history:
            return []

        # ensure oldest → newest
        chron = list(reversed(history))
        # keep only last N turns (oldest→newest, so take the tail)
        if len(chron) > self.MAX_HISTORY_TURNS:
            chron = chron[-self.MAX_HISTORY_TURNS:]

        out: List[Dict[str, str]] = []
        for row in chron:
            sender_raw = (row.get("sender") or "").lower()
            role = "user" if sender_raw == "user" else "assistant"
            content = row.get("message") or ""
            if content.strip():
                out.append({"role": role, "content": content})
        return out

    def _call_ollama(self, messages):
        import os
        import json
        import requests
        import logging
        from google.auth import default
        from google.auth.transport import requests as google_requests
        from google.oauth2 import service_account
        from google.oauth2 import id_token

        logger = logging.getLogger(__name__)
        print("📡 Calling Ollama...")

        try:
            cloud_run_url = os.getenv("CLOUD_RUN_URL")  # e.g. https://gemma3-1b-xxx.run.app
            sa_key_path = os.getenv("SA_KEY_JSON")
            model = "gemma3:1b"
            ollama_api_url = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/chat")

            print(f"🌐 CLOUD_RUN_URL: {cloud_run_url}")
            print(f"🔐 SA_KEY_JSON: {sa_key_path}")
            print(f"🤖 MODEL: {model}")

            if cloud_run_url:
                print("--- Beginning Cloud Run Call Logic ---")
                auth_request = google_requests.Request()
                token = None

                if sa_key_path and os.path.exists(sa_key_path):
                    print("🔑 Using service account key file")
                    credentials = service_account.IDTokenCredentials.from_service_account_file(
                        sa_key_path, target_audience=cloud_run_url
                    )
                    credentials.refresh(auth_request)
                    token = credentials.token
                else:
                    print("🔐 Using default GCP credentials (Workload Identity)")
                    credentials, _ = default()
                    token = id_token.fetch_id_token(auth_request, cloud_run_url)

                if not token:
                    raise ValueError("Failed to obtain authentication token.")

                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }

                # send full messages to a chat endpoint, streaming
                payload = {
                    "model": model,
                    "messages": messages,
                    "stream": True
                }
                endpoint = f"{cloud_run_url}/api/chat"

                print(f"🚀 Sending request to Cloud Run at: {endpoint}")
                print(f"🔍 Request Headers: {headers}")
                print(f"🔍 Request Payload: {json.dumps(payload)[:500]}...")
                print("🔍 Request Messages:")
                for message in payload["messages"]:
                    print(f"  {message['role']}: {message['content']}")

                response = requests.post(endpoint, headers=headers, json=payload)
                print(f"✅ Received response with status code: {response.status_code}")
                response.raise_for_status()

                print(f"✅ Status check passed. Processing response...")
                full_content = ""
                for line in response.text.splitlines():
                    try:
                        chunk = json.loads(line)
                        content_chunk = (chunk.get("message", {}) or {}).get("content") or chunk.get("response", "")
                        full_content += content_chunk
                        if chunk.get("done", False):
                            break
                    except json.JSONDecodeError:
                        print(f"⚠️ Failed to decode chunk: {line}")
                        continue

                full_content = full_content.strip()
                return {"message": {"content": full_content}}

            else:
                print("--- Beginning Local Ollama Call Logic ---")
                headers = {"Content-Type": "application/json"}
                payload = {
                    "model": model,
                    "messages": messages,
                    "stream": True
                }
                response = requests.post(ollama_api_url, headers=headers, json=payload, stream=True)
                response.raise_for_status()

                full_content = ""
                for line in response.iter_lines():
                    if line:
                        try:
                            chunk = json.loads(line.decode("utf-8"))
                            content_chunk = chunk.get("message", {}).get("content") or chunk.get("response", "")
                            full_content += content_chunk
                            if chunk.get("done", False):
                                break
                        except Exception as e:
                            print(f"⚠️ Failed to decode chunk: {line} — {e}")

                return {"message": {"content": full_content}}

        except Exception as e:
            logger.error(f"❌ Error calling model: {e}")
            raise

    # --- Accept optional history and inject it
    def create_init_messages(self, query: str, profile_dict: dict, history: List[Dict[str, Any]] = None):
        # expected fields
        elements1 = ['name', 'age', 'sex', 'height', 'weight', 'activity_level', 'diet', 'goal']
        elements2 = ['allergies', 'likes', 'dislikes']
        

        # safe formatting (skip missing/empty)
        parts = []
        for e in elements1:
            val = (profile_dict or {}).get(e)
            if val not in (None, "", []):
                parts.append(f"{e}: {val}")
        for e in elements2:
            vals = (profile_dict or {}).get(e) or []
            if isinstance(vals, (list, tuple)):
                if vals:
                    parts.append(f"{e}: {', '.join(map(str, vals))}")
            elif vals not in (None, ""):
                parts.append(f"{e}: {vals}")

        profile_str = ', '.join(parts) if parts else "unknown"

        messages: List[Dict[str, str]] = [
            {"role": "system", "content": self.system_prompt},
            {"role": "system", "content": f"User profile: {profile_str}"},
        ]

        # inject short-term memory (oldest→newest)
        if history:
            # If it's already [{role, content}] (as sent by chat_routes.py), append directly.
            if isinstance(history, list) and history and isinstance(history[0], dict) and "role" in history[0]:
                # trim to last N if needed
                trimmed = history[-self.MAX_HISTORY_TURNS:] if len(history) > self.MAX_HISTORY_TURNS else history
                messages.extend(trimmed)
            else:
                # Otherwise assume DB shape and convert
                messages.extend(self._history_to_messages(history))
            # DEBUG: log how many history turns got injected
            print(f"[DEBUG] Injected {len(history)} chat turns into prompt")

        # current user query last
        messages.append({"role": "user", "content": query})
        

        return messages
    

    # (1) meal logging
    def call_meal_logging(self, query, user_context, messages, result) -> dict:
        ret_dict = meal_logging(query, user_context['profile']['user_id'])  # user_id only

        # get the summary (placeholder currently unused)
        answer = ret_dict['final_answer']
        summary = ""

        messages.append(
            {"role": "assistant", "content": f"The nutrients of the meal are {summary}"}
        )
        messages.append(
            {"role": "system",
             "content": ("Analyze the nutrient intake with respect to the user profile and goals, and provide friendly and empathetic feedback. "
                         "Be positive and encouraging considering the user's goal. "
                         "Also DO NOT be critical if the user ate too much undesirable nutrients. "
                         "Suggest a next meal and give a short description. "
                         "Remember TLDR; Make the response as concise as possible.")}
        )

        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")

        result["reasoning"] = ret_dict["reasoning"]
        result["ret_context"] = ret_dict["context_used"]
        result["final_answer"] = ret_dict["final_answer"] + f"\nFeedback: {response_content}"
        return result

    # (2) personalized meal planning
    def call_meal_planning(self, query, user_context, messages, result) -> dict:
        prompt = meal_planning(user_context)  # from tools.py
        messages.append({"role": "system", "content": prompt})

        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")

        result["reasoning"] = "A meal is generated and suggested."
        result["ret_context"] = response_content
        result["final_answer"] = f"A recommended meal has been found successfully.\n{response_content}"
        return result

    # (3) personal health advice
    def call_personal_health_advice(self, query_embedding, user_context, messages, result) -> dict:
        prompt = personal_health_advice()
        messages.append({"role": "system", "content": prompt})

        ret_dict = self.retriever.retrieve(query_embedding)
        messages.append({"role": "user",
                         "content": f"Context: {ret_dict['ret_context']}\n\nPlease use the context above to answer the query."})

        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")

        result["reasoning"] = ret_dict["reasoning"]
        result["ret_source"] = ret_dict["ret_source"]
        result["ret_score"] = ret_dict["ret_score"]
        result["ret_context"] = ret_dict["ret_context"]
        result["final_answer"] = response_content
        return result

    # (4) educational content
    def call_educational_content(self, query_embedding, user_context, messages, result) -> dict:
        prompt = educational_content()
        messages.append({"role": "system", "content": prompt})

        ret_dict = self.retriever.retrieve(query_embedding)

        if ret_dict["reasoning"] == 'NO_KNOWLEDGE_MATCH':
            result["reasoning"] = ret_dict["reasoning"]
            result["final_answer"] = ("Great question!  But unfortunately, I don't currently have enough information to answer it accurately.\n\n"
                                      "Could you try rephrasing or providing more details?")
            result["ret_source"] = ret_dict["ret_source"]
            result["ret_score"] = ret_dict["ret_score"]
            result["ret_context"] = ret_dict["ret_context"]
            return result

        messages.append({"role": "user",
                         "content": f"Context: {ret_dict['ret_context']}\n\nPlease use the context above to answer the query."})

        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")

        result["reasoning"] = "Educational Content successfully processed"
        result["ret_source"] = ret_dict["ret_source"]
        result["ret_score"] = ret_dict["ret_score"]
        result["ret_context"] = ret_dict["ret_context"]
        result["final_answer"] = response_content
        return result

    def get_response(self, query: str, user_context: dict = None) -> dict:
        """Generate a response based on the query and user context"""
        result = {
            "query": query,
            "reasoning": None,
            "intent": None,
            "intent_score": 0.0,
            "ret_source": None,
            "ret_score": 0.0,
            "ret_context": None,
            "final_answer": ""
        }

        if not query or not query.strip():
            result["reasoning"] = "No valid query provided."
            result["final_answer"] = "Please provide a valid query."
            return result

        query_embedding = self.retriever.embed_query(query)
        intent_result = self.intent_classifier.classify_from_embedding(query_embedding)

        result["intent"] = intent_result["top_intent"]
        result["intent_score"] = intent_result["top_score"]

        if intent_result["top_intent"] == 'OUT_OF_SCOPE':
            result["reasoning"] = "Query out of scope"
            result["final_answer"] = (
                "This query is out of scope. I'm here to help with questions about food, nutrition, and health.\n"
                "Please try again."
            )
            return result
        
        top_intent = intent_result['top_intent']

        try:
            if top_intent == "Meal-Logging":
                fn = getattr(self, "call_meal_logging")
            elif top_intent == "Meal-Planning-Recipes":
                fn = getattr(self, "call_meal_planning")
            elif top_intent == "Personalized-Health-Advice":
                fn = getattr(self, "call_personal_health_advice")
            else:
                fn = getattr(self, "call_educational_content")

            # NOTE: we now read 'chat_history' (not 'history')
            init_messages = self.create_init_messages(
                query,
                user_context['profile'],
                user_context.get('chat_history')  # ← matches chat_routes.py
            )
            args1 = (query, user_context, init_messages, result)
            args2 = (query_embedding, user_context, init_messages, result)

            if top_intent in ("Meal-Logging", "Meal-Planning-Recipes"):
                result = fn(*args1)
            else:
                result = fn(*args2)
            return result
        except Exception as e:
            logger.error(f"Error during calling tools: {e}")
            raise

        return result


if __name__ == "__main__":
    engine = LocalModel()
    response = engine.get_response(
        "How much protein does tofu contain?",
        {"profile": {}, "chat_history": []}
    )
    print(json.dumps(response, indent=2))