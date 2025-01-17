#!/usr/bin/env zsh

set -e

SLACK_CHANNEL_ID=$1
SLACK_MESSAGE_TEXT=$2

curl -X POST \
  https://slack.com/api/chat.postMessage \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
  -d '{
  "channel": "'$SLACK_CHANNEL_ID'",
  "text": "'$SLACK_MESSAGE_TEXT'"
}'
