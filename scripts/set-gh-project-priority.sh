#!/bin/bash
# scripts/set-gh-project-priority.sh
# Usage: ./scripts/set-gh-project-priority.sh <owner> <project_number> <issue_url> <priority_level>
# Example: ./scripts/set-gh-project-priority.sh thoufeeque22 4 https://github.com/thoufeeque22/directly.social/issues/758 high

set -e

OWNER=$1
PROJECT_NUM=$2
ISSUE_URL=$3
PRIORITY_LEVEL=$4

if [ -z "$PRIORITY_LEVEL" ]; then
  echo "Usage: $0 <owner> <project_number> <issue_url> <priority_level>"
  exit 1
fi

echo "Adding issue to project..."
# 1. Add item and get its ID
ITEM_JSON=$(gh project item-add "$PROJECT_NUM" --owner "$OWNER" --url "$ISSUE_URL" --format json)
ITEM_ID=$(echo "$ITEM_JSON" | jq -r '.id')

if [ "$ITEM_ID" == "null" ] || [ -z "$ITEM_ID" ]; then
  echo "Failed to add item to project or retrieve Item ID."
  exit 1
fi

echo "Fetching project details..."
# 2. Get Project ID
PROJECT_JSON=$(gh project view "$PROJECT_NUM" --owner "$OWNER" --format json)
PROJECT_ID=$(echo "$PROJECT_JSON" | jq -r '.id')

echo "Fetching fields..."
# 3. Get Field ID for 'priority' (case-insensitive) and Option ID
FIELDS_JSON=$(gh project field-list "$PROJECT_NUM" --owner "$OWNER" --format json)
FIELD_ID=$(echo "$FIELDS_JSON" | jq -r '.fields[] | select(.name | ascii_downcase == "priority") | .id')

if [ -z "$FIELD_ID" ]; then
  echo "Could not find a 'priority' field."
  exit 1
fi

OPTION_ID=$(echo "$FIELDS_JSON" | jq -r --arg PRIORITY "$PRIORITY_LEVEL" '.fields[] | select(.name | ascii_downcase == "priority") | .options[] | select(.name | ascii_downcase == ($PRIORITY | ascii_downcase)) | .id')

if [ -z "$OPTION_ID" ]; then
  echo "Could not find an option matching '$PRIORITY_LEVEL' for the priority field."
  exit 1
fi

echo "Setting priority to $PRIORITY_LEVEL..."
# 4. Edit the item
gh project item-edit --id "$ITEM_ID" --project-id "$PROJECT_ID" --field-id "$FIELD_ID" --single-select-option-id "$OPTION_ID"

echo "Success! Issue added to project and priority set to $PRIORITY_LEVEL."
