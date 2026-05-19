# Android Development APK - Quick Start Guide

## Prerequisites
Before building the APK, you need:

1. **Find your computer's local IP address**
   - Windows: Open PowerShell and run `ipconfig`, look for "IPv4 Address" under your WiFi adapter
   - Example: `192.168.1.100`

2. **Update `.env` file**
   - Replace `192.168.1.100` with your actual IP address in the `.env` file:
     ```
     EXPO_PUBLIC_API_URL=http://YOUR_IP:3000
     ```

## Build Steps

### Option 1: EAS Build (Cloud - Recommended for First Build)

1. **Install EAS CLI globally**
   ```bash
   npm install -g eas-cli
   ```

2. **Create free Expo account** (if you don't have one)
   ```bash
   eas login
   ```
   - Go to https://expo.dev
   - Sign up for free
   - Run the command above to log in

3. **Build the APK**
   ```bash
   cd /path/to/project/root
   eas build --platform android --profile preview
   ```
   - This will build in the cloud (takes 5-10 minutes)
   - You'll get a direct link to download the APK when done

4. **Install on Android phone**
   - Download the APK from the link
   - Transfer to your phone (email, cloud storage, or Android File Transfer)
   - Open file manager on phone and tap the APK
   - Install the app

### Option 2: Local Build (Advanced)

Requires Java, Android SDK, NDK - more setup but faster iteration.

## Testing

1. **Start your backend server** (in `Co&Op/` folder)
   ```bash
   node server.js
   ```

2. **Open the app** on your Android phone
   - Make sure phone is on same WiFi as your computer
   - The app should connect to your backend

## Troubleshooting

**App can't connect to backend:**
- Verify your `.env` file has the correct IP address
- Make sure backend server is running
- Check that phone and computer are on same WiFi network
- Try pinging your computer's IP from another device on the network

**Build fails:**
- Make sure `node_modules/` exists: run `npm install`
- Check that `app.json` exists in project root
- Verify you're logged into Expo: `eas whoami`

**EAS Account Issues:**
- Create free account at https://expo.dev
- Log in with: `eas login`
- Your account is free and personal

## Next Steps After First APK

Once the app is working on your phone:
- Customize the UI in `App.tsx`
- Add new screens/features
- Rebuild with `eas build --platform android --profile preview`
