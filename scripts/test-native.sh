#!/bin/bash

# Directly.social: Auto-detecting Native Test Script
# Always provisions a random device, boots it, installs the app, runs tests, and tears it down.

ADB=~/Library/Android/sdk/platform-tools/adb
EMULATOR=~/Library/Android/sdk/emulator/emulator
AVDMANAGER=~/Library/Android/sdk/cmdline-tools/latest/bin/avdmanager
SYS_IMG="system-images;android-37.0;google_apis_playstore_ps16k;arm64-v8a"

echo "❌ Booting a fixed device for testing..."

TARGET_DEV="pixel_9_pro"
AVD_NAME="maestro_${TARGET_DEV}"

echo "⚙️ Ensuring AVD '$AVD_NAME' exists..."
if ! $EMULATOR -list-avds | grep -q "^${AVD_NAME}$"; then
    echo "   Creating new AVD..."
    echo "no" | $AVDMANAGER create avd -n "$AVD_NAME" -k "$SYS_IMG" --device "$TARGET_DEV" --force >/dev/null
else
    echo "   AVD already exists. Reusing..."
fi

HEADED_FLAG="-no-window"
if [[ "$*" == *"--headed"* ]] || [[ "$HEADED" == "true" ]] || [[ "$HEADED" == "1" ]]; then
    echo "👀 Headed mode enabled! Emulator will be visible."
    HEADED_FLAG=""
fi

echo "🚀 Booting Emulator..."
$EMULATOR -avd "$AVD_NAME" -port 5554 $HEADED_FLAG -no-snapshot-save -wipe-data > /dev/null 2>&1 &

echo "⏳ Waiting for Android OS to boot completely..."
$ADB wait-for-device
while [ "$($ADB shell getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
    sleep 2
done
echo "✅ Device Booted!"

echo "🏗️ Building and Installing App..."
CAPACITOR_URL="http://10.0.2.2:3000" npx cap sync android > /dev/null
npx cap run android --no-sync > /dev/null

echo "🧪 Running Maestro Tests..."
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Clean previous results for accurate logging
rm -rf ./test-results/maestro/* 2>/dev/null
maestro test -e E2E_TEST_PASSWORD=$E2E_TEST_PASSWORD --device emulator-5554 --test-output-dir ./test-results/maestro .maestro/
TEST_EXIT_CODE=$?

# Log the results to history
mkdir -p ./test-results
LOG_FILE="./test-results/device-history.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
DEVICE_NAME=$TARGET_DEV

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "[$TIMESTAMP] Device: $DEVICE_NAME | Status: SUCCESS | All tests passed" >> "$LOG_FILE"
else
    # Extract failed test names from maestro screenshots (e.g., screenshot-❌-123-(media-upload).png)
    FAILED_TESTS=$(find ./test-results/maestro -name "*❌*" 2>/dev/null | grep -o '([^)]*)' | tr -d '()' | sort | uniq | tr '\n' ' ' | sed 's/ $//')
    if [ -z "$FAILED_TESTS" ]; then FAILED_TESTS="Unknown"; fi
    echo "[$TIMESTAMP] Device: $DEVICE_NAME | Status: FAILED | Failed Tests: $FAILED_TESTS" >> "$LOG_FILE"
fi

echo "🧹 Tearing down auto-provisioned emulator..."
$ADB -s emulator-5554 emu kill >/dev/null 2>&1 || true

exit $TEST_EXIT_CODE
