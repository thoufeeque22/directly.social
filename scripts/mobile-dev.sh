#!/bin/bash

# Directly.social: Mobile Developer Mode
# This script points the mobile app to a local tunnel URL for branch testing.

PLATFORM=${1:-ios}

echo "🛠️ Entering Mobile Developer Mode for $PLATFORM..."

# 1. Get the tunnel URL
read -p "🔗 Enter your Tunnel/Branch URL (e.g. https://xyz.trycloudflare.com): " TUNNEL_URL

if [ -z "$TUNNEL_URL" ]; then
    echo "❌ URL is required to point the app to your branch."
    exit 1
fi

echo "🔄 Syncing $PLATFORM with URL: $TUNNEL_URL"

# 2. Sync Capacitor with the environment variable
CAPACITOR_URL=$TUNNEL_URL npx cap sync $PLATFORM

# 3. Launch the app on the simulator/emulator
echo "🚀 Launching $PLATFORM Simulator..."
if [ "$PLATFORM" == "ios" ]; then
    npx cap run ios
else
    npx cap run android
fi

echo "✅ Developer Mode Active! The app is now pointing to $TUNNEL_URL"
echo "💡 Note: To return to production, simply run 'npx cap sync' without a URL."
