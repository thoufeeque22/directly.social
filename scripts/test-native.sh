#!/bin/bash

# Directly.social: Auto-detecting Native Test Script
# If a device is running, runs tests immediately.
# If no device is running, it provisions a random device, boots it, installs the app, runs tests, and tears it down.

ADB=~/Library/Android/sdk/platform-tools/adb
EMULATOR=~/Library/Android/sdk/emulator/emulator
AVDMANAGER=~/Library/Android/sdk/cmdline-tools/latest/bin/avdmanager
SYS_IMG="system-images;android-34;google_apis;arm64-v8a" # Assuming arm64 for mac

echo "🔍 Checking for connected devices..."
TARGET_ID=$($ADB devices | grep -v "List" | grep "device$" | head -n 1 | awk '{print $1}')

TEARDOWN_NEEDED=false

if [ -z "$TARGET_ID" ]; then
    echo "❌ No device running. Booting a random device..."
    
    echo "🔍 Fetching available device profiles..."
    mapfile -t ALL_DEVICES < <($AVDMANAGER list device | grep -E "^id: " | grep -oE '"[^"]+"' | tr -d '"' | grep -iE "(pixel|nexus|galaxy|phone)")
    RANDOM_DEV="${ALL_DEVICES[$RANDOM % ${#ALL_DEVICES[@]}]}"
    
    AVD_NAME="maestro_auto"
    echo "⚙️ Provisioning AVD: $AVD_NAME as a '$RANDOM_DEV'..."
    if $EMULATOR -list-avds | grep -q "^${AVD_NAME}$"; then
        $AVDMANAGER delete avd -n "$AVD_NAME" >/dev/null
    fi
    echo "no" | $AVDMANAGER create avd -n "$AVD_NAME" -k "$SYS_IMG" --device "$RANDOM_DEV" --force >/dev/null
    
    echo "🚀 Booting Emulator..."
    $EMULATOR -avd "$AVD_NAME" -no-window -no-snapshot-save -wipe-data > /dev/null 2>&1 &
    
    echo "⏳ Waiting for Android OS to boot completely..."
    $ADB wait-for-device
    while [ "$($ADB shell getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
        sleep 2
    done
    echo "✅ Device Booted!"
    
    echo "🏗️ Building and Installing App..."
    npx cap sync android > /dev/null
    npx cap run android --no-sync > /dev/null
    
    TEARDOWN_NEEDED=true
else
    echo "✅ Found connected device: $TARGET_ID"
fi

echo "🧪 Running Maestro Tests..."
export $(grep -v '^#' .env | xargs)
# Clean previous results for accurate logging
rm -rf ./test-results/maestro/* 2>/dev/null
maestro test -e E2E_TEST_PASSWORD=$E2E_TEST_PASSWORD --test-output-dir ./test-results/maestro .maestro/
TEST_EXIT_CODE=$?

# Log the results to history
mkdir -p ./test-results
LOG_FILE="./test-results/device-history.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
DEVICE_NAME=${RANDOM_DEV:-$TARGET_ID}

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "[$TIMESTAMP] Device: $DEVICE_NAME | Status: SUCCESS | All tests passed" >> "$LOG_FILE"
else
    # Extract failed test names from maestro screenshots (e.g., screenshot-❌-123-(media-upload).png)
    FAILED_TESTS=$(find ./test-results/maestro -name "*❌*" 2>/dev/null | grep -o '([^)]*)' | tr -d '()' | sort | uniq | tr '\n' ' ' | sed 's/ $//')
    if [ -z "$FAILED_TESTS" ]; then FAILED_TESTS="Unknown"; fi
    echo "[$TIMESTAMP] Device: $DEVICE_NAME | Status: FAILED | Failed Tests: $FAILED_TESTS" >> "$LOG_FILE"
fi

if [ "$TEARDOWN_NEEDED" = true ]; then
    echo "🧹 Tearing down auto-provisioned emulator..."
    $ADB emu kill >/dev/null 2>&1 || true
fi

exit $TEST_EXIT_CODE
