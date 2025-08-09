import logging
import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routers import user_routes, nutrient_routes, chat_routes

from .local_model import LocalModel #or
#from .model import Model
from .potts import IntentClassifier

os.environ["TOKENIZERS_PARALLELISM"] = "false"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI(
    title="DietBot Backend API",
    description="API for managing users, nutrient intake, and chat interactions.",
    version="1.0.0"
)

## 7/7/2025 nt: removed
#classifier = IntentClassifier()
#model = LocalModel()

origins = [
    "http://localhost:3000",
    "https://dietbot-frontend-329764297954.us-central1.run.app",
    "http://www.dietbotchat.com",
    "https://www.dietbotchat.com"
     # add your production frontend here later
]

print("✅ CORS Middleware active for:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # no wildcard if credentials = True
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_routes.router)
app.include_router(nutrient_routes.router)
app.include_router(chat_routes.router)

@app.get("/health", tags=["health"])
async def health_check():
    """Simple endpoint to confirm the app is running."""
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("dietbot.main:app", host="0.0.0.0", port=port)