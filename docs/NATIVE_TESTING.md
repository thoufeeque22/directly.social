# 📱 Native App Testing Guide (Maestro)

This guide explains how to run automated E2E tests on the native iOS and Android apps directly from your terminal, without opening Xcode or Android Studio.

## ⚡ Full Automation (One Click)
If you want the script to automatically detect your running device, build the app, install it, and run the tests, use:

```bash
# For iOS
npm run test:native:full
```bash
# For Android
npm run test:native:full -- android
```

---

## 🛠️ Testing Local Branch Changes
To see your local branch changes and the **Tester Login** on the simulator:

1. Ensure your local server and tunnel are running (handled manually by the User).
2. Launch Developer Mode:
   ```bash
   # Enter your tunnel URL when prompted
   npm run mobile:dev
   ```

---

## 🚀 Manual Workflow (Terminal Only)


### **1. Launch a Device**
You must have an emulator or simulator running before starting Maestro.

**For iOS:**
```bash
npm run mobile:ios
```

**For Android:**
```bash
# Launches the first available AVD in your list
npm run mobile:android
```

### **2. Run Native Tests**
Once the device is visible, execute the Maestro flows:
```bash
npm run test:native
```

---

## 🛠️ Maestro CLI Basics

### **Continuous Mode (Auto-run on save)**
Maestro can watch your YAML files and re-run tests instantly when you save changes:
```bash
maestro test -c .maestro/smoke.yaml
```

### **Maestro Studio (Visual Selector Tool)**
If you need to find the `id` or `text` of a native element, launch the interactive studio:
```bash
maestro studio
```
This opens a web interface at `http://localhost:1905` where you can click on elements to see their selectors.

---

## 📂 Directory Structure: `.maestro/`

- **`config.yaml`**: Global configuration (includes `appId`).
- **`smoke.yaml`**: Basic dashboard load and navigation check.
- **`refresh.yaml`**: Verifies the native Pull-to-Refresh gesture.

---

## ⚠️ Troubleshooting

### **"0 devices connected"**
Ensure your simulator is fully booted. For Android, you can check connected devices with:
```bash
adb devices
```

### **"App not found"**
Maestro expects the app to be installed on the device. If you haven't built the app yet:
1. Run `npm run cap:sync`
2. Build/Run via terminal or IDE once to install it on the emulator.

### **Android Path Issues**
The `mobile:android` script assumes the default macOS Android SDK path. If your SDK is located elsewhere, update the path in `package.json`.
