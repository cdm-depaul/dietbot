from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os
import subprocess

app = FastAPI()

# === Configuration ===
GCS_MODEL_PATH = "gs://hf-dietbot-ft-model/jshargo-gemma-3N-finetune-4B"
LOCAL_MODEL_DIR = "/app/model-cache"
MODEL_NAME = os.getenv("OLLAMA_MODEL", LOCAL_MODEL_DIR)

# === Download from GCS if not already present ===
def download_model_from_gcs():
    if not os.path.exists(LOCAL_MODEL_DIR):
        os.makedirs(LOCAL_MODEL_DIR)
    if not os.listdir(LOCAL_MODEL_DIR):
        print(f"☁️ Downloading model weights from GCS: {GCS_MODEL_PATH} → {LOCAL_MODEL_DIR}")
        try:
            subprocess.run([
                "gsutil", "-m", "cp", "-r",
                f"{GCS_MODEL_PATH}/*", LOCAL_MODEL_DIR
            ], check=True)
            print("✅ Download complete.")
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to download model: {e}")
            raise

@app.on_event("startup")
async def startup_event():
    print("🚀 FastAPI app starting...")
    download_model_from_gcs()

    print(f"🔄 [Startup] Loading model from: {LOCAL_MODEL_DIR}")
    print("🔍 Checking for GPU availability...")
    global dtype, tokenizer, model

    if torch.cuda.is_available():
        print("✅ GPU is available. Using torch.float16.")
        dtype = torch.float16
    else:
        print("⚠️ GPU not available. Using CPU with torch.float32.")
        dtype = torch.float32

    print("📦 Loading tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(LOCAL_MODEL_DIR)

    print("📦 Loading model weights...")
    model = AutoModelForCausalLM.from_pretrained(
        LOCAL_MODEL_DIR,
        torch_dtype=dtype,
        device_map="auto"
    )
    print(f"✅ Model loaded to device: {model.device}")
    print("🟢 Ready to serve requests.")

# === Request schema ===
class GenerationRequest(BaseModel):
    model: str
    prompt: str

# === Generation endpoint ===
@app.post("/api/generate")
async def generate_text(request: GenerationRequest):
    print("📨 [Request] Incoming text generation request...")
    print(f"🧠 Requested model: {request.model}")
    print(f"✍️ Prompt: {request.prompt[:100]}{'...' if len(request.prompt) > 100 else ''}")

    prompt = request.prompt.strip()
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)

    print("🔁 Generating response...")
    output_ids = model.generate(
        **inputs,
        max_new_tokens=512,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        top_k=50,
        repetition_penalty=1.1
    )

    output_text = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    if output_text.startswith(prompt):
        output_text = output_text[len(prompt):].strip()

    print("✅ Generation complete.")
    print(f"📝 Output (first 200 chars): {output_text[:200]}{'...' if len(output_text) > 200 else ''}")

    return {"response": output_text}

# === Health check ===
@app.get("/")
async def health_check():
    print("🔍 Health check requested.")
    return {"status": "ok", "model": MODEL_NAME}

# === For local testing ===
if __name__ == "__main__":
    import uvicorn
    download_model_from_gcs()
    uvicorn.run("main:app", host="0.0.0.0", port=8080)