#!/bin/bash

# Directly.social: Full Native Automation Script
# This script builds, installs, and runs Maestro tests on a running simulator/emulator.

PLATFORM=${1:-ios} # Default to ios

echo "🚀 Starting Full Native Automation for $PLATFORM..."

if [ "$PLATFORM" == "ios" ]; then
    echo "🔍 Detecting booted iOS Simulator..."
    TARGET_ID=$(xcrun simctl list devices | grep Booted | head -n 1 | sed -E 's/.* \(([-0-9A-F]+)\).*/\1/')
    
    if [ -z "$TARGET_ID" ]; then
        echo "❌ No booted iOS Simulator found. Opening default simulator..."
        open -a Simulator
        echo "⏳ Waiting for simulator to boot (this may take a minute)..."
        # Wait until a device is booted
        while [ -z "$TARGET_ID" ]; do
            sleep 5
            TARGET_ID=$(xcrun simctl list devices | grep Booted | head -n 1 | sed -E 's/.* \(([-0-9A-F]+)\).*/\1/')
        done
        echo "✅ Simulator detected: $TARGET_ID"
    else
        echo "✅ Found booted Simulator: $TARGET_ID"
    fi

    echo "🏗️ Building and Installing app on iOS..."
    npx cap run ios --target "$TARGET_ID" --no-sync
    
elif [ "$PLATFORM" == "android" ]; then
    echo "🔍 Detecting connected Android devices..."
    # Check for running emulators
    TARGET_ID=$(adb devices | grep -v "List" | grep "device" | head -n 1 | awk '{print $1}')
    
    if [ -z "$TARGET_ID" ]; then
        echo "❌ No Android emulator found. Attempting to start the first available AVD..."
        AVD_NAME=$(~/Library/Android/sdk/emulator/emulator -list-avds | head -n 1)
        if [ -z "$AVD_NAME" ]; then
            echo "❌ No Android Virtual Devices (AVD) found. Please create one in Android Studio."
            exit 1
        fi
        ~/Library/Android/sdk/emulator/emulator -avd "$AVD_NAME" &
        echo "⏳ Waiting for emulator to appear in adb..."
        while [ -z "$TARGET_ID" ]; do
            sleep 5
            TARGET_ID=$(adb devices | grep -v "List" | grep "device" | head -n 1 | awk '{print $1}')
        done
        echo "✅ Android device detected: $TARGET_ID"
    else
        echo "✅ Found Android device: $TARGET_ID"
    fi

    echo "🏗️ Building and Installing app on Android..."
    npx cap run android --target "$TARGET_ID" --no-sync
else
    echo "❌ Unsupported platform: $PLATFORM. Use 'ios' or 'android'."
    exit 1
fi

echo "🧪 Running Maestro Tests..."
npm run test:native
