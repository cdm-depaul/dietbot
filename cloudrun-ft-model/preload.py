from transformers import AutoTokenizer, AutoModelForCausalLM
import time

MODEL_NAME = "jshargo/gemma-3N-finetune-4B"

def log_step(message):
    print(f"🕐 {time.strftime('%H:%M:%S')} — {message}")

try:
    log_step(f"Starting model preload: {MODEL_NAME}")

    # Load tokenizer
    log_step("Downloading tokenizer config and files...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    log_step("✅ Tokenizer loaded successfully.")

    # Load model
    log_step("Downloading model config and weights...")
    model = AutoModelForCausalLM.from_pretrained(MODEL_NAME)
    log_step("✅ Model weights loaded successfully.")

    # Confirm completion
    log_step("🎉 Preloading complete. Ready to serve!")

except Exception as e:
    log_step("❌ Error during preload:")
    print(e)
    raise