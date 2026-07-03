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

# Define the Device Matrix
TARGET_DEVICES=("small_phone" "pixel_9_pro")
NUM_EMULATORS=${#TARGET_DEVICES[@]}

DEVICES_USED=""

# 1. Provision AVDs with the fixed hardware profiles
for i in $(seq 1 $NUM_EMULATORS); do
    TARGET_DEV="${TARGET_DEVICES[$((i-1))]}"
    AVD_NAME="maestro_${TARGET_DEV}"
    
    DEVICES_USED+="$TARGET_DEV "
    
    echo "⚙️ Ensuring AVD '$AVD_NAME' exists..."
    
    # Create only if it doesn't exist
    if ! $EMULATOR -list-avds | grep -q "^${AVD_NAME}$"; then
        echo "   Creating new AVD as '$TARGET_DEV'..."
        echo "no" | $AVDMANAGER create avd -n "$AVD_NAME" -k "$SYS_IMG" --device "$TARGET_DEV" --force >/dev/null
    else
        echo "   AVD already exists. Reusing..."
    fi
done

HEADED_FLAG="-no-window"
if [[ "$*" == *"--headed"* ]] || [[ "$HEADED" == "true" ]] || [[ "$HEADED" == "1" ]]; then
    echo "👀 Headed mode enabled! Emulators will be visible."
    HEADED_FLAG=""
fi

# 2. Boot Emulators
echo "🔋 Booting $NUM_EMULATORS Emulators..."
for i in $(seq 1 $NUM_EMULATORS); do
    TARGET_DEV="${TARGET_DEVICES[$((i-1))]}"
    AVD_NAME="maestro_${TARGET_DEV}"
    PORT=$((5552 + i * 2)) # 5554, 5556
    echo "   Starting $AVD_NAME on port $PORT..."
    $EMULATOR -avd "$AVD_NAME" -port $PORT $HEADED_FLAG -no-snapshot-load -no-snapshot-save -no-audio -no-boot-anim -wipe-data -metrics-to-console &
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
echo "📦 Building and Installing APK to all emulators..."
CAPACITOR_URL="http://10.0.2.2:3000" npx cap sync android > /dev/null
cd android && ./gradlew assembleDebug && cd ..

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
rm -rf ./test-results/maestro/* 2>/dev/null
maestro test -e E2E_TEST_PASSWORD=$E2E_TEST_PASSWORD --device emulator-5554,emulator-5556 --shard-split $NUM_EMULATORS --test-output-dir ./test-results/maestro .maestro/
TEST_EXIT_CODE=$?

# Log the results to history
mkdir -p ./test-results
LOG_FILE="./test-results/device-history.log"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "[$TIMESTAMP] Devices: $DEVICES_USED | Status: SUCCESS | All parallel tests passed" >> "$LOG_FILE"
else
    # Extract failed test names from maestro screenshots
    FAILED_TESTS=$(find ./test-results/maestro -name "*❌*" 2>/dev/null | grep -o '([^)]*)' | tr -d '()' | sort | uniq | tr '\n' ' ' | sed 's/ $//')
    if [ -z "$FAILED_TESTS" ]; then FAILED_TESTS="Unknown"; fi
    echo "[$TIMESTAMP] Devices: $DEVICES_USED | Status: FAILED | Failed Tests: $FAILED_TESTS" >> "$LOG_FILE"
fi

# 6. Teardown
echo "🧹 Tearing down emulators..."
for i in $(seq 1 $NUM_EMULATORS); do
    PORT=$((5554 + (i - 1) * 2))
    $ADB -s emulator-$PORT emu kill >/dev/null 2>&1 || true
done

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo "⚠️ Some tests failed, check test-results/maestro."
    exit $TEST_EXIT_CODE
else
    echo "🎉 Orchestration complete!"
fi
