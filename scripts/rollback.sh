#!/bin/bash

# Social Studio Rollback Script
# This script rolls back the 'current' symlink to a previous release.

set -e

# Setup paths
BASE_DIR="${DEPLOY_BASE_DIR:-$HOME/social-studio-app}"
CURRENT_DIR="$BASE_DIR/current"
RELEASES_DIR="$BASE_DIR/releases"

echo "🔙 Starting Social Studio Rollback..."

if [ ! -d "$RELEASES_DIR" ]; then
    echo "❌ Error: Releases directory does not exist at $RELEASES_DIR"
    exit 1
fi

# List available releases for reference
echo "📂 Available releases (sorted by date, newest first):"
ls -1dt "$RELEASES_DIR"/* | xargs -n 1 basename

# Determine target release
if [ -z "$1" ]; then
    # No argument: find the second newest release (the one before the current one)
    CURRENT_LINK=$(readlink -f "$CURRENT_DIR" || echo "")
    
    echo "🔗 Current release: $(basename "$CURRENT_LINK")"
    
    # Get the newest release that is NOT the current one
    TARGET_RELEASE_PATH=$(ls -dt "$RELEASES_DIR"/* | grep -v "$CURRENT_LINK" | head -n 1 || true)
    
    if [ -z "$TARGET_RELEASE_PATH" ]; then
        echo "❌ Error: No previous release found to roll back to."
        exit 1
    fi
    
    TARGET_RELEASE=$(basename "$TARGET_RELEASE_PATH")
else
    # Use provided argument
    TARGET_RELEASE="$1"
    TARGET_RELEASE_PATH="$RELEASES_DIR/$TARGET_RELEASE"
    
    if [ ! -d "$TARGET_RELEASE_PATH" ]; then
        echo "❌ Error: Target release directory not found: $TARGET_RELEASE_PATH"
        exit 1
    fi
fi

echo "🔄 Rolling back current symlink to: $TARGET_RELEASE"

# Perform atomic swap
ln -sfn "$TARGET_RELEASE_PATH" "$CURRENT_DIR"

# Restart PM2 processes
echo "🔄 Restarting PM2 processes from $CURRENT_DIR..."
cd "$CURRENT_DIR"

# Try to restart specific processes, fallback to start if they don't exist
pm2 restart social-studio --update-env || pm2 start "npm run start" --name "social-studio"
pm2 restart social-studio-worker --update-env || pm2 start "npm run worker" --name "social-studio-worker"

echo "✅ Rollback complete! Social Studio is now running version: $TARGET_RELEASE"
