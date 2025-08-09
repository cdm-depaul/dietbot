#!/bin/bash
set -euo pipefail

PROJECT_ID="depaul-dietbot-dev"
REGION="us-central1"
SERVICE_NAME="dietbot-frontend"
BACKEND_URL="https://dietbot-backend-329764297954.us-central1.run.app"

echo "🔧 Using BACKEND_URL: $BACKEND_URL"

# Build with Cloud Build using the YAML (bakes the URL into the client bundle)
echo "🐳 Building Docker image with NEXT_PUBLIC_BACKEND_URL baked in..."
# The change is here: we submit the entire directory with `.`
gcloud builds submit . \
  --config frontend/cloudbuild.yaml \
  --substitutions _NEXT_PUBLIC_BACKEND_URL="$BACKEND_URL" \
  --project "$PROJECT_ID"

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "gcr.io/$PROJECT_ID/$SERVICE_NAME" \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT_ID"

echo -e "\n✅ Deployment complete!"
echo "🌍 URL:"
gcloud run services describe "$SERVICE_NAME" \
  --platform managed \
  --region "$REGION" \
  --project "$PROJECT_ID" \
  --format 'value(status.url)'
