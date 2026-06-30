#!/bin/bash
set -e

# ==============================================================================
# Parallel Maestro Testing Script
# Automates AVD creation, booting, APK installation, and sharded test execution.
# ==============================================================================

export ANDROID_HOME="$HOME/Library/Android/sdk"
AVDMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/avdmanager"
EMULATOR="$ANDROID_HOME/emulator/emulator"
ADB="$ANDROID_HOME/platform-tools/adb"
SDKMANAGER="$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager"

SYS_IMG="system-images;android-37.0;google_apis_playstore_ps16k;arm64-v8a"
NUM_EMULATORS=2
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"

# Ensure tools exist
if [ ! -f "$AVDMANAGER" ]; then
    echo "❌ avdmanager not found at $AVDMANAGER. Please install Android Command-line Tools via Android Studio."
    exit 1
fi

echo "🚀 Starting Parallel Mobile Test Orchestration..."

# Dynamically fetch all phone/tablet profiles from Android Studio
echo "🔍 Fetching available device profiles..."
mapfile -t ALL_DEVICES < <($AVDMANAGER list device | grep -E "^id: " | grep -oE '"[^"]+"' | tr -d '"' | grep -iE "(pixel|nexus|galaxy|phone)")

# 1. Provision AVDs with random hardware profiles
for i in $(seq 1 $NUM_EMULATORS); do
    AVD_NAME="maestro_emu_$i"
    
    # Pick a random device profile from the dynamic list
    RANDOM_DEV="${ALL_DEVICES[$RANDOM % ${#ALL_DEVICES[@]}]}"
    
    echo "⚙️ Provisioning AVD: $AVD_NAME as a '$RANDOM_DEV'..."
    
    # Delete if exists so we can recreate it with a new profile
    if $EMULATOR -list-avds | grep -q "^${AVD_NAME}$"; then
        $AVDMANAGER delete avd -n "$AVD_NAME" >/dev/null
    fi
    
    echo "no" | $AVDMANAGER create avd -n "$AVD_NAME" -k "$SYS_IMG" --device "$RANDOM_DEV" --force
done

# 2. Boot Emulators
echo "🔋 Booting $NUM_EMULATORS Emulators Headlessly..."
for i in $(seq 1 $NUM_EMULATORS); do
    AVD_NAME="maestro_emu_$i"
    PORT=$((5552 + i * 2)) # 5554, 5556
    echo "   Starting $AVD_NAME on port $PORT..."
    $EMULATOR -avd "$AVD_NAME" -port $PORT -no-window -no-snapshot-load -no-snapshot-save -no-audio -no-boot-anim -wipe-data -metrics-to-console &
done

# 3. Wait for Boot Completion
echo "⏳ Waiting for emulators to finish booting (this can take a minute)..."
for i in $(seq 1 $NUM_EMULATORS); do
    PORT=$((5552 + i * 2))
    DEVICE="emulator-$PORT"
    $ADB -s $DEVICE wait-for-device
    echo "   $DEVICE is connected. Waiting for system to boot..."
    
    # Wait until sys.boot_completed is 1
    while [ "$($ADB -s $DEVICE shell getprop sys.boot_completed | tr -d '\r')" != "1" ]; do
        sleep 2
    done
    echo "   ✅ $DEVICE fully booted!"
done

# 4. Install APK
echo "📦 Installing APK to all emulators..."
if [ ! -f "$APK_PATH" ]; then
    echo "⚠️ APK not found at $APK_PATH! Building now..."
    cd android && ./gradlew assembleDebug && cd ..
fi

for i in $(seq 1 $NUM_EMULATORS); do
    PORT=$((5552 + i * 2))
    DEVICE="emulator-$PORT"
    echo "   Installing on $DEVICE..."
    $ADB -s $DEVICE install -r "$APK_PATH"
done

# 5. Run Maestro Sharded Tests
echo "🧪 Running Maestro Parallel Tests..."
# Export environment variables from .env if needed
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Run tests and shard split them
maestro test -e E2E_TEST_PASSWORD=$E2E_TEST_PASSWORD --shard-split $NUM_EMULATORS --test-output-dir ./test-results/maestro .maestro/ || echo "⚠️ Some tests failed, check test-results/maestro."

# 6. Teardown
echo "🧹 Tearing down emulators..."
for i in $(seq 1 $NUM_EMULATORS); do
    PORT=$((5552 + i * 2))
    DEVICE="emulator-$PORT"
    $ADB -s $DEVICE emu kill || true
done

echo "🎉 Orchestration complete!"
