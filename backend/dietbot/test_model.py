def _call_ollama(self, messages):
    """Call Cloud Run Gemma3:1b model with SA key, hardcoded for debug and dev use."""
    import json, time, os
    from google.oauth2 import service_account
    from google.auth.transport.requests import Request

    try:
        # 🔒 Hardcoded values for debug/dev
        cloud_run_url = "https://gemma3-1b-j7lsjhfgua-uc.a.run.app"
        sa_key_path = "dietbot-gemma-sa.json"
        model = "gemma3:1b"

        # 🧾 Print debug values
        print(f"[DEBUG] CLOUD_RUN_URL: {cloud_run_url}")
        print(f"[DEBUG] SA_KEY_JSON: {sa_key_path}")

        with open(sa_key_path, "r") as f:
            sa_data = json.load(f)
            print(f"[DEBUG] SA project_id: {sa_data.get('project_id')}")
            print(f"[DEBUG] SA client_email: {sa_data.get('client_email')}")
            print(f"[DEBUG] SA client_id: {sa_data.get('client_id')}")

        # 📝 Get user prompt from messages
        user_prompt = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
        if not user_prompt:
            raise ValueError("No user prompt found in messages.")

        # 🔐 Authenticate
        credentials = service_account.IDTokenCredentials.from_service_account_file(
            sa_key_path, target_audience=cloud_run_url
        )
        credentials.refresh(Request())
        token = credentials.token

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        payload = {"model": model, "prompt": user_prompt}

        endpoint = f"{cloud_run_url}/api/generate"
        print(f"[DEBUG] Calling Cloud Run: {endpoint}")
        print(f"\n📝 Prompt: {user_prompt}\n")
        print("🧠 Gemma says:\n")

        # 🚀 Send request to Cloud Run
        response = requests.post(endpoint, headers=headers, json=payload, stream=True)
        response.raise_for_status()

        # 🧾 Handle stream
        output = ""
        start_time = time.time()
        token_count = 0
        metadata = {}

        for line in response.iter_lines():
            if line:
                try:
                    chunk = json.loads(line.decode("utf-8"))
                    if "response" in chunk:
                        print(chunk["response"], end="", flush=True)
                        output += chunk["response"]
                        token_count += 1
                    if chunk.get("done", False) and "eval_count" in chunk:
                        metadata = chunk
                except Exception as e:
                    print(f"\n⚠️ Error parsing line: {line}\n{e}")

        end_time = time.time()

        # 📊 Summary
        print("\n\n---")
        print(f"✅ Tokens returned: {metadata.get('eval_count', token_count)}")
        print(f"⏱️ Duration: {(end_time - start_time):.2f} sec")
        print(f"📦 Prompt tokens: {metadata.get('prompt_eval_count', 'N/A')}")
        print(f"🧪 Inference time: {metadata.get('eval_duration', 'N/A')} ns")

        return {"message": {"content": output}}

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error calling Cloud Run: {e}")
        raise



def _call_ollama(self, messages):
        """Call Ollama locally or Cloud Run if CLOUD_RUN_URL is set."""
        import os, json, time
        import requests
        from google.oauth2 import service_account
        from google.auth.transport.requests import Request

        print("\n🔁 Starting model call process...")
        try:
            cloud_run_url = os.getenv("CLOUD_RUN_URL")
            sa_key_path = os.getenv("SA_KEY_JSON")
            model = self.model or "gemma3"

            print(f"🌐 Environment - Cloud Run URL: {cloud_run_url or 'Not set'}")
            print(f"📄 Service Account JSON Path: {sa_key_path or 'Not set'}")
            print(f"🤖 Model: {model}")

            if cloud_run_url:
                # ---- Cloud Run Flow ----
                print("\n🚀 Sending request to Cloud Run endpoint...")

                # Load service account key
                with open(sa_key_path, "r") as f:
                    sa_data = json.load(f)
                    print(f"🔐 Auth project: {sa_data.get('project_id')}")
                    print(f"📧 Auth email: {sa_data.get('client_email')}")

                # Create ID token for auth
                credentials = service_account.IDTokenCredentials.from_service_account_file(
                    sa_key_path, target_audience=cloud_run_url
                )
                credentials.refresh(Request())
                token = credentials.token

                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }

                # Extract user prompt
                user_prompt = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
                payload = {
                    "model": model,
                    "prompt": user_prompt
                }

                endpoint = f"{cloud_run_url}/generate"
                print(f"📡 Calling: {endpoint}")
                print(f"📝 Prompt: {user_prompt}")
                response = requests.post(endpoint, headers=headers, json=payload, stream=True)

            else:
                # ---- Local Ollama Flow ----
                from dietbot.constants import OLLAMA_API_URL
                print("\n💻 Using local Ollama instance...")

                headers = {"Content-Type": "application/json"}
                payload = {
                    "model": model,
                    "messages": messages,
                    "stream": True
                }

                print(f"📡 Calling: {OLLAMA_API_URL}")
                response = requests.post(OLLAMA_API_URL, headers=headers, json=payload, stream=True)

            response.raise_for_status()

            # Process streamed response
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
                        print(f"⚠️ Skipped malformed chunk: {e}")

            print("\n✅ Model response successfully received.\n")
            return {"message": {"content": full_content}}

        except Exception as e:
            print(f"❌ Model call failed: {e}")
            raise