# iOS App Store Submission Guide

## Prerequisites

### Apple Developer Account
- [ ] Active Apple Developer Program membership ($99/year)
- [ ] Team ID and provisioning profiles set up
- [ ] App ID registered: `com.MohammadZayed.minigolf`

### Development Environment
- [ ] Xcode 15+ installed
- [ ] macOS Sonoma or later
- [ ] Physical iOS device for testing (iPhone or iPad)

---

## Step 1: Prepare the Web Build

### Build the React Application

```bash
cd "/Users/mohammadzayed/Desktop/Mini Golf Score Card/ui"

# Install dependencies (if not already installed)
npm install

# Build for production
npm run build
```

**What this does:**
- Creates optimized production build in `dist/` directory
- Minifies JavaScript and CSS
- Optimizes images
- Generates service worker for PWA features

**Verify the build:**
```bash
# Check that dist directory was created
ls -la dist/

# Should see: index.html, assets/, and other files
```

---

## Step 2: Sync with Capacitor

### Copy Web Build to iOS Project

```bash
# Still in ui/ directory
npx cap sync ios
```

**What this does:**
- Copies `dist/` contents to iOS app bundle
- Updates native plugins
- Syncs configuration from capacitor.config.json
- Updates CocoaPods dependencies

**Verify the sync:**
```bash
# Check iOS public folder
ls -la ios/App/App/public/

# Should see index.html and assets from your build
```

---

## Step 3: Open in Xcode

```bash
# Open the iOS project in Xcode
npx cap open ios

# OR manually:
open "ios/App/App.xcworkspace"
```

**IMPORTANT:** Always open `.xcworkspace`, NOT `.xcodeproj` (because of CocoaPods)

---

## Step 4: Configure Xcode Project

### 4.1 Select Your Team

1. Click on "App" project in left sidebar
2. Select "App" target
3. Under "Signing & Capabilities" tab:
   - Check "Automatically manage signing"
   - Select your Apple Developer Team from dropdown
   - Bundle Identifier should be: `com.MohammadZayed.minigolf`

### 4.2 Set Version and Build Number

1. In the same "General" tab:
   - **Version:** 1.0
   - **Build:** 1

### 4.3 Verify App Icons

1. Click on "Assets" in left sidebar
2. Expand "Assets.xcassets"
3. Click on "AppIcon"
4. Verify all icon sizes show your golf ball logo
   - Should see icons from 20x20 to 1024x1024

### 4.4 Verify Launch Screen

1. In left sidebar, navigate to: `App > Base.lproj > LaunchScreen.storyboard`
2. Click on it to preview
3. Should show your splash screen with golf ball

### 4.5 Add Privacy Manifest to Build

1. In Xcode, right-click on "App" folder in left sidebar
2. Select "Add Files to App..."
3. Navigate to: `App/PrivacyInfo.xcprivacy`
4. Check "Copy items if needed"
5. Check "App" target
6. Click "Add"

**Verify it's added:**
- Look in left sidebar under "App" folder
- Should see "PrivacyInfo.xcprivacy" listed

### 4.6 Set Deployment Target

1. Click on "App" project in left sidebar
2. Select "App" target
3. Under "General" tab:
   - **Minimum Deployments:** iOS 15.0

### 4.7 Configure Build Settings

1. Click "Build Settings" tab
2. Search for "Dead Code Stripping"
   - Set to: YES
3. Search for "Strip Debug Symbols"
   - Set to: YES (for Release only)

---

## Step 5: Test on Physical Device

### 5.1 Connect Device

1. Connect iPhone/iPad via USB
2. Unlock device
3. Trust computer if prompted

### 5.2 Select Device in Xcode

1. At top of Xcode, click device dropdown (next to "App" scheme)
2. Select your connected device (not simulator)

### 5.3 Build and Run

1. Click the "Play" button (▶) or press Cmd+R
2. App will compile and install on device
3. If prompted, trust developer certificate on device:
   - Settings → General → VPN & Device Management
   - Tap your developer profile
   - Tap "Trust"

### 5.4 Test Thoroughly

Test all features on the physical device:

**Guest Mode:**
- [ ] Create a new game without account
- [ ] Add 3-4 players
- [ ] Score multiple holes (+/- buttons work)
- [ ] View leaderboard mid-game
- [ ] Complete game and see results with confetti
- [ ] Close app and reopen - guest game should persist

**Account Mode:**
- [ ] Create new account
- [ ] Login with account
- [ ] Create game with account
- [ ] Score and complete game
- [ ] View game in History
- [ ] Check player win statistics
- [ ] Logout and login again - history should persist

**General:**
- [ ] App launches quickly
- [ ] All buttons respond immediately
- [ ] No crashes or freezes
- [ ] Rotation locked to portrait (iPhone)
- [ ] Status bar displays correctly
- [ ] Navigation works smoothly
- [ ] Network requests complete successfully

---

## Step 6: Create Archive for App Store

### 6.1 Select "Any iOS Device"

1. In device dropdown at top of Xcode
2. Select "Any iOS Device (arm64)"
3. Do NOT select a specific device or simulator

### 6.2 Archive the App

1. Menu: **Product → Archive**
2. Wait for Xcode to build (may take 2-5 minutes)
3. Archives window will open automatically when complete

**If build fails:**
- Check Console for errors
- Common fixes:
  - Clean build folder: **Product → Clean Build Folder**
  - Update CocoaPods: `cd ios/App && pod install`
  - Verify signing team is selected

### 6.3 Validate Archive (Optional but Recommended)

1. In Archives window, select your archive
2. Click "Validate App" button
3. Select your team
4. Choose automatic signing
5. Click "Validate"
6. Wait for validation to complete
7. Fix any issues that appear

**Common validation warnings (safe to ignore):**
- ITMS-90809: Deprecated API Usage (if using older Capacitor plugins)
- Missing compliance for encryption (we'll handle this in App Store Connect)

---

## Step 7: Upload to App Store Connect

### 7.1 Distribute Archive

1. In Archives window, click "Distribute App"
2. Select "App Store Connect"
3. Click "Next"
4. Select "Upload"
5. Click "Next"
6. Choose automatic signing
7. Review and click "Upload"
8. Wait for upload to complete (5-15 minutes depending on connection)

**Monitor upload:**
- Progress bar shows upload status
- Don't close Xcode until complete
- You'll get confirmation when finished

### 7.2 Alternative: Upload via Transporter

If Xcode upload fails, use Transporter app:

1. In Archives window, click "Distribute App"
2. Select "App Store Connect"
3. Select "Export"
4. Save .ipa file to Desktop
5. Open Transporter app
6. Drag .ipa file into Transporter
7. Click "Deliver"

---

## Step 8: Configure App Store Connect

### 8.1 Access App Store Connect

1. Go to: https://appstoreconnect.apple.com
2. Sign in with Apple Developer account
3. Click "My Apps"

### 8.2 Create New App

1. Click the "+" button
2. Select "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Mini Golf Score Tracker
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Select `com.MohammadZayed.minigolf`
   - **SKU:** minigolf-scoretracker (or any unique identifier)
   - **User Access:** Full Access

### 8.3 Fill in App Information

Navigate through tabs and fill in all required info:

#### App Information Tab
- **Name:** Mini Golf Score Tracker
- **Subtitle:** Track Scores & Win Stats
- **Category:**
  - Primary: Games > Sports
  - Secondary: Lifestyle
- **Content Rights:** Check if you have all rights
- **Age Rating:** Click "Edit" and answer questionnaire (should result in 4+)

#### Pricing and Availability
- **Price:** Free
- **Availability:** All countries/regions

#### Privacy
- **Privacy Policy URL:** https://minigolfscoretracker.com/privacy
- **Privacy Choices URL:** (leave blank unless you have one)

### 8.4 Prepare for Submission

Click on "1.0 Prepare for Submission":

#### App Privacy
1. Click "Edit" or "Get Started"
2. Answer questions based on your app:
   - **Do you collect data?** Yes
   - **User ID:** Yes → Linked to user → App Functionality
   - **Name:** Yes → Linked to user → App Functionality
   - **Other User Content:** Yes → Linked to user → App Functionality
   - **Do you use data for tracking?** No
3. Publish privacy choices

#### Screenshots

Upload screenshots for:
- iPhone 6.7" Display (required)
- iPhone 6.5" Display (optional but recommended)
- iPad Pro 12.9" Display (optional)

**Creating screenshots:**

Option 1: Use iPhone simulator and Xcode
```bash
# Build and run on simulator
# Screenshot each key screen:
# - Home page
# - Game setup
# - Live scoring
# - Leaderboard
# - Results

# Screenshots saved to Desktop by default
```

Option 2: Screenshot from physical device
- Run app on device
- Take screenshots with device buttons
- AirDrop or download from iCloud Photos

**Screenshot dimensions:**
- 6.7": 1290 x 2796 pixels
- 6.5": 1242 x 2688 pixels
- 12.9" iPad: 2048 x 2732 pixels

#### Description

Copy from `APP_STORE_METADATA.md`:
- **Promotional Text:** (170 chars)
- **Description:** (full description, max 4000 chars)
- **Keywords:** mini golf,score,scorecard,leaderboard,golf,tracker,scores,putt,putting,game,stats
- **Support URL:** https://minigolfscoretracker.com/contact
- **Marketing URL:** https://minigolfscoretracker.com

#### What's New
```
Welcome to Mini Golf Score Tracker!

This is our initial release featuring:

✨ Simple live scoring for mini golf games
📊 Real-time leaderboard during gameplay
🏆 Automatic player win statistics
📱 Guest mode for instant play without account
💾 Optional account for game history across devices
🎉 Celebration confetti for winners
⚡ Lightning-fast performance

Download now and enjoy hassle-free mini golf scoring!
```

#### Build

1. Under "Build" section, click "+"
2. Select your uploaded build (may take 15-30 min to process after upload)
3. Click "Done"

If build doesn't appear:
- Wait 15-30 minutes for processing
- Check email for processing completion
- Refresh App Store Connect page

#### App Review Information

**Contact Information:**
- First Name: Mohammad
- Last Name: Zayed
- Phone: [Your phone number]
- Email: mohammadzayed521@gmail.com

**Demo Account (if required):**
- Username: testuser
- Password: Test1234!
- Notes: You can also test without account in guest mode

**Notes for Reviewer:**
```
Mini Golf Score Tracker is a simple scorecard tracking app for mini golf games.

TO TEST THE APP:
1. Launch the app
2. Tap "Get Started" or "Start as Guest"
3. Select "Create Course" and enter 9 holes
4. Add 2-3 test players (e.g., "Alice", "Bob", "Charlie")
5. Tap through holes using +/- buttons to enter scores
6. Tap "Leaderboard" button to view live standings
7. Complete all holes to see final results

ACCOUNT FEATURES (optional):
- Username: testuser
- Password: Test1234!

Or create a new account to test registration flow.

All features work in both authenticated and guest modes. Guest mode stores data locally on device only.

No special configurations or setups required.
```

#### Export Compliance

- **Does your app use encryption?**
  - Select "No" (standard HTTPS doesn't require compliance)

If asked specifically about HTTPS:
- Check "Yes, it uses HTTPS" only if explicitly required
- Most apps can select "No" for encryption export compliance

---

## Step 9: Submit for Review

### 9.1 Final Review

Before submitting, verify:
- [ ] All required fields filled in
- [ ] Screenshots uploaded
- [ ] Build selected
- [ ] Privacy policy URL works
- [ ] Support URL works
- [ ] App review information complete
- [ ] Demo account credentials work (if provided)

### 9.2 Submit

1. Click "Add for Review" button (top right)
2. Review submission summary
3. Click "Submit to App Review"

**What happens next:**
1. **In Review** status (typically 24-48 hours)
2. Apple reviews your app
3. You may get requests for more info
4. **Approved** or **Rejected** notification via email

### 9.3 If Rejected

Don't panic! Rejection is common for first submissions.

Common rejection reasons:
- Missing privacy manifest (you have this!)
- Incomplete metadata
- App crashes during review
- Demo account doesn't work

**What to do:**
1. Read rejection message carefully
2. Fix the specific issues mentioned
3. Reply to reviewer if you need clarification
4. Upload new build if code changes needed
5. Resubmit

---

## Step 10: After Approval

### When App is Approved

1. You'll receive email notification
2. App status changes to "Pending Developer Release"
3. You can either:
   - **Manually release:** Click "Release This Version"
   - **Auto release:** It releases automatically (if configured)

### Post-Launch

- [ ] Test downloading from App Store
- [ ] Verify all features work in production
- [ ] Monitor user reviews
- [ ] Respond to support emails
- [ ] Track crash reports in App Store Connect

---

## Troubleshooting

### Common Issues

**Build fails with code signing error:**
- Go to Signing & Capabilities
- Check "Automatically manage signing"
- Select correct team
- Clean build folder and try again

**"No accounts with App Store Connect access" error:**
- Verify Apple Developer membership is active
- Check payment status in developer.apple.com
- May need to wait 24-48 hours after joining program

**App crashes on device but works in simulator:**
- Check Console logs in Xcode
- Verify API URL is correct (HTTPS)
- Test network connectivity on device
- Check for device-specific issues (memory, iOS version)

**Archive option is greyed out:**
- Select "Any iOS Device (arm64)" not simulator
- Ensure scheme is set to "Release"
- Check provisioning profiles are valid

**Upload fails / stalls:**
- Check internet connection
- Try Transporter app instead of Xcode
- Verify bundle ID matches App Store Connect
- Check for firewall blocking upload

**Build doesn't appear in App Store Connect:**
- Wait 15-30 minutes for processing
- Check for email from Apple about processing errors
- Verify bundle ID and version number
- Check for invalid entitlements

---

## Resources

### Official Documentation
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Xcode Help](https://help.apple.com/xcode/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

### Your App Files
- Metadata: `/Users/mohammadzayed/Desktop/Mini Golf Score Card/APP_STORE_METADATA.md`
- iOS Project: `/Users/mohammadzayed/Desktop/Mini Golf Score Card/ui/ios/App/`
- Privacy Manifest: `/Users/mohammadzayed/Desktop/Mini Golf Score Card/ui/ios/App/App/PrivacyInfo.xcprivacy`

### Support
- Developer Forums: https://developer.apple.com/forums/
- App Review: https://developer.apple.com/contact/app-store/
- Technical Support: https://developer.apple.com/support/

---

## Quick Command Reference

```bash
# Navigate to project
cd "/Users/mohammadzayed/Desktop/Mini Golf Score Card/ui"

# Install dependencies
npm install

# Build for production
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Update CocoaPods (if needed)
cd ios/App && pod install && cd ../..

# Check Capacitor status
npx cap doctor
```

---

## Timeline Estimate

**First-time submission:**
- Build preparation: 1-2 hours
- Testing on device: 1-2 hours
- Creating screenshots: 1-2 hours
- App Store Connect setup: 1-2 hours
- Review wait time: 24-48 hours
- **Total: 3-7 days**

**Update submissions:**
- Build and test: 30-60 minutes
- Upload: 15-30 minutes
- Review: 24-48 hours
- **Total: 1-3 days**

---

Good luck with your submission! 🚀
