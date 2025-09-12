# DietBot Project v. 1.2

NT: My branch (as of 9/11/2025)

Important notes:

1. **Two LLMs** (Javis in the RAG chain: off-the-shelf Gemma3 with prompt engineering) and Ms. Potts for the user interaction/conversations: off-the-shelf Gemma2 with prompt engineering).  Note that Ms. Potts is implemented in **def _call_ollama(self, messages)** (in local_model.py) as below.  This is NOT the ideal way or place to do so, but the for the time being, it's added in this way (in the call to Ollama):

            """--------COMMENT OUT till the end 
            8/20 nt: incorporate a second LLM (Ms.Potts)
            """
            ## Call the second LLM to rephrase the output string to be more empathetic.
            # 2. STRUCTURE THE CHAT HISTORY for the next call
            # This is the crucial step. We create a list of messages.
            # The 'user' message contains the summary and our new instruction.
            messages = [
                {
                    "role": "user",
                    "content": f"Here is the response from Jarvis: '{full_content}'. Now, please act as a friendly dietitian and rephrase it in a much more empathetic tone."
                }
            ]
            
            # 3. SECOND CALL: Use /api/chat with Gemma2 for creative writing
            chat_payload = {
                "model": "my-gemma2", #"gemma2", # Different model for the second task
                "messages": messages, # We pass the list of messages, not a single 'prompt'
                "stream": False
            }

            print("Getting story from gemma2...")
            response_2 = requests.post(OLLAMA_API_URL, json=chat_payload)
            chat_result = response_2.json()
            
            final_story = chat_result['message']['content']
            return {"message": {"content": final_story}}
            """-------COMMENT end """

2. **Test cases** 

The current code assumes the code "run-test.py" to be executed in the "backend" folder.

python .\run_test.py

For the purpose of running one query at a time, the input data to the script and the output file are set as follows:

    testfile = "./evaluate/testsent-3.csv"
    outfile = "./evaluate/9-12-testsent-3-out.csv"

where testsent-3.csv contains only just one query sentence.


