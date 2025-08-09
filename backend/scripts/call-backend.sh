#!/bin/bash

# === CONFIGURATION ===
SERVICE_URL="https://gemma3-1b-329764297954.us-central1.run.app/api/generate"
MODEL="gemma3:1b"
PROMPT="${1:-What should I eat to lower my blood sugar?}"
ID_TOKEN=$(gcloud auth print-identity-token)                         

# === REQUIREMENT: ID_TOKEN must be exported in your shell ===
if [[ -z "$ID_TOKEN" ]]; then
  echo "❌ ID_TOKEN is not set. Run: export ID_TOKEN=\$(gcloud auth print-identity-token)"
  exit 1
fi

# === PAYLOAD ===
JSON_PAYLOAD=$(jq -n \
  --arg model "$MODEL" \
  --arg prompt "$PROMPT" \
  '{model: $model, prompt: $prompt}')

echo "📤 Sending prompt to $SERVICE_URL ..."
echo "📝 Prompt: $PROMPT"
echo ""

# === CURL REQUEST ===
curl -s -X POST "$SERVICE_URL" \
  -H "Authorization: Bearer $ID_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" | \
  jq -r 'select(.response) | .response' | \
  tr -d '\n'

echo -e "\n✅ Done"
