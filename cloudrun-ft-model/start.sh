#!/bin/bash

echo "🔥 Preloading model..."
python preload.py

echo "🚀 Starting FastAPI server..."
exec uvicorn main:app --host 0.0.0.0 --port 8080