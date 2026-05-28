#!/bin/bash

# Social Studio Atomic Update Script
# This script performs a full build and atomic deployment on the VPS.

set -e

echo "🚀 Starting Social Studio Atomic Update..."

# 1. Setup paths
BASE_DIR="${DEPLOY_BASE_DIR:-$HOME/social-studio-app}"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$BASE_DIR/releases/$TIMESTAMP"
CURRENT_DIR="$BASE_DIR/current"

# Ensure releases directory exists
mkdir -p "$BASE_DIR/releases"

echo "📂 Creating new release at $RELEASE_DIR..."

# 2. Prepare new release directory
# We clone from GitHub to ensure a clean state for the new release.
echo "📥 Cloning from GitHub..."
git clone --depth 1 --branch main https://github.com/thoufeeque22/social-studio-app.git "$RELEASE_DIR"

cd "$RELEASE_DIR"

# 3. Symlink shared .env
if [ -f "$BASE_DIR/.env" ]; then
    echo "🔗 Symlinking .env..."
    ln -sfn "$BASE_DIR/.env" .env
else
    echo "⚠️ Warning: $BASE_DIR/.env not found. Build might fail if required."
fi

# 4. Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# 5. Generate Prisma and Build
echo "🏗️ Generating Prisma client..."
npx prisma generate
echo "🏗️ Building production app..."
npm run build

# 6. Atomic swap symlink
echo "🔄 Swapping symlink to $RELEASE_DIR..."
ln -sfn "$RELEASE_DIR" "$CURRENT_DIR"

# 7. Restart PM2 processes
echo "🔄 Restarting background worker and server..."
cd "$CURRENT_DIR"
pm2 restart social-studio --update-env || pm2 start "npm run start" --name "social-studio"
pm2 restart social-studio-worker --update-env || pm2 start "npm run worker" --name "social-studio-worker"

# 8. Cleanup old releases (keep last 5)
echo "🧹 Cleaning up old releases..."
# List all folders in releases, sort by time, skip the first 5, and remove the rest
ls -dt "$BASE_DIR/releases"/* | tail -n +6 | xargs -r rm -rf --

echo "✅ Atomic update complete! Social Studio is back online."
