import json
import os
import logging
import requests
from dotenv import load_dotenv
from typing import Tuple, List

## 6/29/2025 nt: path fixed -- but reverted later after successful system integration
from .potts import IntentClassifier
#from potts import IntentClassifier
from .retriever import Retriever
#from retriever import Retriever
from .tools import meal_planning, meal_logging, personal_health_advice, educational_content

# Logging configuration
#logging.basicConfig(level=logging.INFO) ## 7/6/2025 nt: keep INFO level
logger = logging.getLogger(__name__)

load_dotenv()

DEFAULT_MODEL = "dietbot"
AGENT_LOOP_LIMIT = 3
# Read Ollama API URL from environment variable, defaulting to localhost if not set
OLLAMA_API_URL = os.getenv('OLLAMA_API_URL', 'http://localhost:11434/api/chat')

class LocalModel:
    def __init__(self) -> None:
        """Initialize model components"""
        try:
            self.intent_classifier = IntentClassifier()
            self.retriever = Retriever()
        except Exception as e:
            logger.error(f"Failed to initialize components (IntentClassifier/Retriever): {e}")
            raise
        
        self.model = os.getenv('OLLAMA_MODEL', DEFAULT_MODEL)
        self.agent_loop_limit = AGENT_LOOP_LIMIT
        
        # Base system prompt
        self.system_prompt = (
            "You are an AI assistant whose primary goal is to answer user questions as accurately and effectively as possible. "
            "You are also a professional dietitian, with expert knowledge on food, nutrients and human health. "
            "Furthermore, you are a personal dietitian to the user.  Take every consideration of the user's biometric and dietary profile in responding. "
            "Also, respond in a gentle, kind, and empathetic tone. "

        )

    def _call_ollama(self, messages):
        """Make API call to local Ollama model and process streaming response"""
        try:
            payload = {
                "model": self.model,
                "messages": messages
            }
            
            # Use the configured OLLAMA_API_URL
            response = requests.post(OLLAMA_API_URL, json=payload, stream=True)
            response.raise_for_status()
            
            # Process the streaming response
            full_content = ""
            for line in response.iter_lines():
                if line:
                    try:
                        chunk = json.loads(line.decode('utf-8'))
                        content_chunk = chunk.get("message", {}).get("content", "")
                        full_content += content_chunk
                        
                        # Check if this is the final message
                        if chunk.get("done", False):
                            break
                    except json.JSONDecodeError:
                        logger.warning(f"Failed to decode JSON from line: {line}")
            
            return {"message": {"content": full_content}}
        except Exception as e:
            logger.error(f"Error calling Ollama API: {e}")
            raise
    
    ## 7/11/2025 nt:
    def create_init_messages(self, query: str, profile_dict : dict):
        elements1 = ['name', 'age', 'sex', 'height', 'weight', 'activity_level', 'diet', 'goal'] # single text
        elements2 = ['allergies', 'likes', 'dislikes'] # list of text

        profile = [f"{element}: {profile_dict[element]}" for element in elements1] + \
                  [f"{element}: {', '.join(profile_dict[element])}" for element in elements2]

        profile_str = ', '.join(profile) # to make one string (accepted by the messages format)
                   
        init_messages = [
            {"role": "user", "content": query},
            {"role": "system", "content": self.system_prompt},
            {"role": "system", 
             "content": f"User profile: {profile_str}"}
        ]
        return init_messages
    

    ## (1) 7/11/2025 nt: for meal logging
    def call_meal_logging(self, query, user_context, messages, result) -> dict:
        # first call the meal_logging tool in tools.py to get a dictionary
        ret_dict = meal_logging(query, user_context['profile']['user_id']) # user_id only
       
        # get the summary
        answer = ret_dict['final_answer']
        summary = ""
        if "success" in answer:
           try:
               pos = answer.index('\n')
               summary = answer[pos:] # nt: needs parsing... later
           except ValueError:
               print("Error finding the second line in final answer")

        ## Evaluate the food intake and give encouraging feedback to the user.
        ## Add another role instruction in messages:
        messages.append(
            {"role": "assistant", 
             "content": f"The nutrients of the meal are {summary}"}
        )
        messages.append(
            {"role": "system", 
             "content": ("Analyze the nutrient intake with respect to the user profile and goals, and provide friendly and empathetic feedback. "
                         "Be positive and encouraging considering the user's goal. "
                         "Also DO NOT be critical if the user ate too much undesirable nutrients. "
                         "Suggest a next meal and give a short description. "
                         "Remember TLDR; Make the response as concise as possible.")
            }
        )
                  
        ## cal ollama with the enhanced messages
        #print (f'   ======== (1) Meal logging ollama messages: {messages} ===========')
        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")
        #print (f'      ===> (1) Meal logging ollama response: {response_content} ===>>>>>>>>>>>')
    
        ## overwrite the final answer with the additional feedback!
        result["reasoning"] = ret_dict["reasoning"]
        result["ret_context"] = ret_dict["context_used"]
        result["final_answer"] = ret_dict["final_answer"] + f"\nFeedback: {response_content}"
        return result


    ## (2) 7/11/2025 nt: for personalized meal planning
    def call_meal_planning(self, query, user_context, messages, result) -> dict:
        # first call the meal_planning in tools.py to get the intent-specific prompt string
        prompt = meal_planning(user_context) # from tool.py; 
        
        # use the prompt to enhance messages
        messages.append({"role": "system", "content": prompt}) # this includes 'thinking process/steps'...
        
        ## call ollama with the enhanced messages
        #print (f'   ======== (2) Meal-planning ollama messages: {messages} ===========')
        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")
        #print (f'      ===> (2) Meal-plannig ollama response: {response_content} ===>>>>>>>>>>>')
        
        ## overwrite the final result and return it
        result["reasoning"] = "A meal is generated and suggested."
        result["ret_context"] = response_content
        result["final_answer"] = f"A recommended meal has been found successfully.\n{response_content}"
        return result

    
    ## (3) 7/12/2025 nt: personal_health_advice
    def call_personal_health_advice(self, query_embedding, user_context, messages, result) -> dict:
        # get the intent-specific prompt string
        prompt = personal_health_advice();
        
        ## use the prompt to enhance messages
        messages.append({"role": "system", "content": prompt}) # emphasizes on ACCURACY and personalization
        
        ## call retriever to get related facts from the KB
        ret_dict = self.retriever.retrieve(query_embedding) # embedding of original query
        #print (f'------ RAG retrieved context ({ret_dict["ret_source"]}): {ret_dict["ret_context"]} -------')
        
	    ## add the retrieved context in the messags
        messages.append({
            "role": "user", 
            "content": f"Context: {ret_dict["ret_context"]}\n\nPlease use the context above to answer the query."}
        )

        ## call ollama with the enhanced messages
        #print (f'   ======== (3) Personalized Health Advice messages: {messages} ===========')
        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")
        #print (f'      ===> (3) Health Advice ollama response: {response_content} ===>>>>>>>>>>>')
        
        ## overwrite the final result and return it
        result["reasoning"] = ret_dict["reasoning"]
        result["ret_source"] = ret_dict["ret_source"]
        result["ret_score"] = ret_dict["ret_score"]
        result["ret_context"] = ret_dict["ret_context"]
        result["final_answer"] = response_content
        return result


    ## (4) 7/12/2025 nt: educational_content
    def call_educational_content(self, query_embedding, user_context, messages, result) -> dict:
        # get the intent-specific prompt string
        prompt = educational_content();
        
        ## use the prompt to enhance messages
        messages.append({"role": "system", "content": prompt}) # emphasizes on ACCURACY
        
        ## call retriever to get related facts from the KB
        ret_dict = self.retriever.retrieve(query_embedding) # embedding of original query
        #print (f'------ RAG retrieved context ({ret_dict["ret_source"]}): {ret_dict["ret_context"]} -------')
        
        ## 7/22 return without fallback LLM call if KB doesn't have an answer
        if ret_dict["reasoning"] == 'NO_KNOWLEDGE_MATCH':
            result["reasoning"] = ret_dict["reasoning"]
            result["final_answer"] = "Great question!  But unfortunately, I don't currently have enough information to answer it accurately.\n\nCould you try rephrasing or providing more details?"
            result["ret_source"] = ret_dict["ret_source"]
            result["ret_score"] = ret_dict["ret_score"]
            result["ret_context"] = ret_dict["ret_context"]
            return result # (*) non-local exit

        # else:
	    ## add the retrieved context in the messags
        messages.append({
            "role": "user", 
            "content": f"Context: {ret_dict["ret_context"]}\n\nPlease use the context above to answer the query."}
        )

        ## (*) call ollama with the enhanced messages
        #print (f'   ======== (4) Educational-Content messages: {messages} ===========')
        ollama_response = self._call_ollama(messages)
        response_content = ollama_response.get("message", {}).get("content", "")
        #print (f'      ===> (4) Educational-Content ollama response: {response_content} ===>>>>>>>>>>>')
        
        ## overwrite the final result and return it
        result["reasoning"] = "Educational Content successfully processed"
        result["ret_source"] = ret_dict["ret_source"]
        result["ret_score"] = ret_dict["ret_score"]
        result["ret_context"] = ret_dict["ret_context"]
        result["final_answer"] = response_content
        return result
		

    # Response generation method with classification RAG
    def get_response(self, query: str, user_context: dict = None) -> dict:
        """Generate a response based on the query and user context"""
        # default return dict
        result = {
            "query": query,     # directly from argument
            "reasoning": None,  # overall result
            "intent": None,
            "intent_score": 0.0,
            "ret_source": None,
            "ret_score": 0.0,
            "ret_context": None,
            "final_answer": ""
        }

        # check if query is properly provided
        if not query or not query.strip():
            result["reasoning"] = "No valid query provided."
            result["final_answer"] = "Please provide a valid query."
            return result  # (*) non-local exit

	    ## 7/6/2025 nt: change to reject by intent (non-food/nutrient related) first
        query_embedding = self.retriever.embed_query(query)
        intent_result = self.intent_classifier.classify_from_embedding(query_embedding)
        
        ## fill in the top intent score in result
        result["intent"] = intent_result["top_intent"]
        result["intent_score"] = intent_result["top_score"]
        
        ## if an IMMEDIATE out of scope (by intent classifier), return an empty dict
        if intent_result["top_intent"] == 'OUT_OF_SCOPE':
            result["reasoning"] = "Query out of scope"
            result["final_answer"] = \
                ("This query is out of scope. I'm here to help with questions about food, nutrition, and health.\n"
                 "Please try again.")
            return result  # (*) non-local exit
        
        ## 7/7/2025 nt: if query is relevant, report classification result immediately (for debugging)
        top_intent = intent_result['top_intent']
        #print(f'^^^^^^^^ Top intent = {top_intent}, score = {intent_result['top_score']} ^^^^^^^^')
         
        ## Calling Tools (when the first intent is above threshold)
        ## Note: this can be made into 'Tool Calls' (typically used in recent AI) :)
        try:
            ## identify the name of the tool function to call (tedious code but clear)
            fn_name = ""
            if top_intent == "Meal-Logging": # (1)
                fn_name = "call_meal_logging"
            elif top_intent == "Meal-Planning-Recipes": # (2)
                fn_name = "call_meal_planning"
            elif top_intent == "Personalized-Health-Advice": # (3)
                fn_name = "call_personal_health_advice"
            else: # "Educational-Content" # (4)
                fn_name = "call_educational_content"
                
            ## set the tool function name
            fn = getattr(self, fn_name)

            ## create initial message (common to all intents) and fn args
            init_messages = self.create_init_messages(query, user_context['profile'])
            args1 = (query, user_context, init_messages, result) 
            args2 = (query_embedding, user_context, init_messages, result) # query_embedding instead of query str

            ## (*) invoke the function by name with appropriate arguments
            if top_intent == "Meal-Logging" or top_intent == "Meal-Planning-Recipes":
            	result = fn(*args1)
            else:
                result = fn(*args2)
			    
        except Exception as e:
            logger.error(f"Error during calling tools: {e}")
            raise

        # Format the final result
        #print (result)
        return result


if __name__ == "__main__":
    engine = LocalModel()
    #response = engine.get_response("What is the importance of protein?")
    response = engine.get_response("How much protein does tofu contain?")
    print(json.dumps(response, indent=2)) 