import json
import requests
import time
from google.oauth2 import service_account
from google.auth.transport.requests import Request

# --- CONFIG ---
KEY_FILE = "dietbot-gemma-sa.json"
SERVICE_URL = "https://gemma3-1b-j7lsjhfgua-uc.a.run.app"
ENDPOINT = f"{SERVICE_URL}/api/generate"
AUDIENCE = SERVICE_URL
PROMPT = "What is fiber good for?"
MODEL = "gemma3:1b"

# --- AUTH ---
credentials = service_account.IDTokenCredentials.from_service_account_file(
    KEY_FILE, target_audience=AUDIENCE
)
credentials.refresh(Request())
token = credentials.token

# --- REQUEST ---
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
payload = {"model": MODEL, "prompt": PROMPT}

print("Calling URL")
print(ENDPOINT)

# --- STREAMED RESPONSE HANDLING ---
print(f"\n📝 Prompt: {PROMPT}\n")
print("🧠 Gemma says:\n")

response = requests.post(ENDPOINT, headers=headers, json=payload, stream=True)

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

# --- FOOTER ---
print("\n\n---")
print(f"✅ Tokens returned: {metadata.get('eval_count', token_count)}")
print(f"⏱️ Duration: {(end_time - start_time):.2f} sec")
print(f"📦 Prompt tokens: {metadata.get('prompt_eval_count', 'N/A')}")
print(f"🧪 Inference time: {metadata.get('eval_duration', 'N/A')} ns")
