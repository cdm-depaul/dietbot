#!/bin/bash

set -e

# === CONFIGURATION ===
IMAGE_NAME="gemma3-1b-dietbot-local"
CONTAINER_NAME="gemma3-1b-dietbot"
PORT=8080
MODEL_ID="jshargo/gemma-3N-finetune-4B"

echo "🔧 Setting up local Gemma3:1B dietbot container..."

# === BUILD IMAGE ===
echo "🐳 Building Docker image: $IMAGE_NAME"
docker build -t "$IMAGE_NAME" --build-arg MODEL_ID="$MODEL_ID" .

# === STOP OLD CONTAINER IF EXISTS ===
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "🧹 Stopping and removing old container: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" && docker rm "$CONTAINER_NAME"
fi

# === RUN CONTAINER ===
echo "🚀 Running container: $CONTAINER_NAME on port $PORT"
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT":8080 \
  -e OLLAMA_MODEL="$MODEL_ID" \
  "$IMAGE_NAME"

echo "✅ Done! Server is running at: http://localhost:$PORT"
echo "🌐 Test it with:"
echo "curl http://localhost:$PORT/api/generate -H 'Content-Type: application/json' -d '{\"model\": \"gemma3:1b\", \"prompt\": \"What should I eat today?\"}'"