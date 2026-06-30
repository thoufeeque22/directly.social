#!/bin/bash
PLATFORM=${1:-android}

echo "🔍 Starting Cloudflare Tunnel in the background..."
# Run cloudflared and pipe stderr (where cloudflared outputs) to a temp file
TMP_FILE=$(mktemp)
cloudflared tunnel --url http://localhost:3000 > /dev/null 2> "$TMP_FILE" &
TUNNEL_PID=$!

# Trap Ctrl+C to kill the tunnel when the user exits
trap "echo '🛑 Stopping tunnel...'; kill $TUNNEL_PID; rm $TMP_FILE; exit" INT

echo "⏳ Waiting for Cloudflare to assign a URL..."

# Loop until we find the URL in the temp file
TUNNEL_URL=""
while [ -z "$TUNNEL_URL" ]; do
    # cloudflared logs look like: |  https://some-url.trycloudflare.com  |
    TUNNEL_URL=$(grep -o 'https://[a-zA-Z0-9-]*\.trycloudflare\.com' "$TMP_FILE" | head -n 1)
    if ! kill -0 $TUNNEL_PID 2>/dev/null; then
        echo "❌ Tunnel failed to start. Logs:"
        cat "$TMP_FILE"
        rm "$TMP_FILE"
        exit 1
    fi
    sleep 1
done

echo "✅ Tunnel established at: $TUNNEL_URL"

echo "🔄 Syncing $PLATFORM with URL: $TUNNEL_URL"
export CAPACITOR_URL=$TUNNEL_URL
npx cap sync $PLATFORM

echo "🔍 Verifying injected config..."
if [ "$PLATFORM" == "android" ]; then
    grep url android/app/src/main/assets/capacitor.config.json
else
    grep url ios/App/App/capacitor.config.json
fi

echo "🚀 Launching $PLATFORM Simulator/Device..."
if [ "$PLATFORM" == "ios" ]; then
    npx cap run ios
else
    npx cap run android
fi

echo "🟢 App is running! Keep this terminal open to keep the tunnel alive."
echo "Press Ctrl+C to stop the tunnel and exit."

# Wait for the background tunnel process to finish (or until user hits Ctrl+C)
wait $TUNNEL_PID
