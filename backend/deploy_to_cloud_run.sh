#!/bin/bash

set -e

# === CONFIGURATION ===
PROJECT_ID="depaul-dietbot-dev"
REGION="us-central1"
SERVICE_NAME="dietbot-backend"
SERVICE_ACCOUNT="dietbot-gemma-as@depaul-dietbot-dev.iam.gserviceaccount.com"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# === LOAD ENV VARS ===
if [ ! -f .env ]; then
  echo "❌ .env file not found! Please create it with required variables."
  exit 1
fi

echo "📥 Loading environment variables from .env..."
export $(grep -v '^#' .env | xargs)

# === REQUIRED ENV VARS CHECK ===
REQUIRED_VARS=(
  HUGGINGFACE_API_KEY
  OPENAI_API_KEY
  RAPIDAPI_KEY
  NUTRITIONIX_APP_ID
  NUTRITIONIX_API_KEY
  SUPABASE_URL
  SUPABASE_ANON_KEY
  GEMMA_API_URL
  CLOUD_RUN_URL
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required env var: $var"
    exit 1
  fi
done

echo "✅ GEMMA_API_URL=$GEMMA_API_URL"


# === BUILD LOCALLY FOR AMD64 ===
echo "🔨 Building Docker image for linux/amd64..."
docker buildx create --use --name dietbot-builder --platform linux/amd64 >/dev/null 2>&1 || true
docker buildx build --platform linux/amd64 -t "$IMAGE" --push .

# === DEPLOY TO CLOUD RUN ===
echo "🚀 Deploying $SERVICE_NAME to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --allow-unauthenticated \
  --service-account="$SERVICE_ACCOUNT" \
  --memory=1Gi \
  --set-env-vars \
"HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY},\
OPENAI_API_KEY=${OPENAI_API_KEY},\
RAPIDAPI_KEY=${RAPIDAPI_KEY},\
NUTRITIONIX_APP_ID=${NUTRITIONIX_APP_ID},\
NUTRITIONIX_API_KEY=${NUTRITIONIX_API_KEY},\
SUPABASE_URL=${SUPABASE_URL},\
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY},\
GEMMA_API_URL=${GEMMA_API_URL},\
SA_KEY_JSON=unused-in-cloudrun,\
CLOUD_RUN_URL=${CLOUD_RUN_URL}"




echo "✅ Deployment complete!"
echo "🌍 Get the URL with:"
echo "    gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)'"
