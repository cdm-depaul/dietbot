import logging
import uvicorn
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
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

classifier = IntentClassifier()
model = LocalModel()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)