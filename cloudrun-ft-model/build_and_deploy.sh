#!/bin/bash

set -e

# ==== CONFIGURATION ====
PROJECT_ID="tidy-fort-443401-n0"
REGION="us-central1"
SERVICE_NAME="gemma3-1b-dietbot-ft"
CONTAINER_NAME="gemma3-1b-dietbot-ft"
IMAGE_URI="gcr.io/${PROJECT_ID}/${CONTAINER_NAME}"
PORT=8080
TIMEOUT="30m"

# Customize this with your actual service account email if needed
SERVICE_ACCOUNT="dietbot-sa@${PROJECT_ID}.iam.gserviceaccount.com"

echo "🔧 Setting active project to: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# ==== BUILD DOCKER IMAGE ====
echo "🐳 Building Docker image: ${CONTAINER_NAME}"
gcloud builds submit \
  --tag "${IMAGE_URI}" \
  --timeout="${TIMEOUT}" \
  .

# ==== DEPLOY TO CLOUD RUN ====
echo "🚀 Deploying service: ${SERVICE_NAME} to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image="${IMAGE_URI}" \
  --cpu=4 \
  --memory=16Gi \
  --concurrency=1 \
  --timeout=900 \
  --max-instances=1 \
  --no-cpu-throttling \
  --no-allow-unauthenticated \
  --region="${REGION}" \
  --port="${PORT}" \
  --service-account="${SERVICE_ACCOUNT}" \
  --timeout=3200 \
  --cpu-boost

echo "✅ Deployment complete!"
echo "🔍 View service logs at:"
echo "   https://console.cloud.google.com/run/detail/${REGION}/${SERVICE_NAME}/logs?project=${PROJECT_ID}"