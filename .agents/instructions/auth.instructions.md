# Authentication Architecture & Known Issues

## Overview
Panther Lounge uses Passport.js with two strategies:
1. **Local Strategy**: Email/password with PBKDF2 hashing
2. **Google OAuth**: Google account linking

## File Locations
- `auth-config/passportLocalSetup.js` - Local strategy configuration
- `auth-config/passportGoogleAuthsetup.js` - Google strategy configuration
- `routes/auth.js` - Auth route handlers
- `controllers/authController.js` - Auth logic (login, logout, create account)

## Local Strategy Workflow

### Account Creation
```
POST /auth/create-account
→ authController.postCreateAccount()
  1. Validate email not already registered
  2. Generate 16-byte random salt: crypto.randomBytes(16).toString("hex")
  3. Hash password: crypto.pbkdf2(password, salt, 310000, 32, "sha256")
  4. Store user: { username, email, hashedPassword (hex), salt }
  5. Call next() → passport.authenticate() middleware
  6. User session created; redirects to profile
```

### Login
```
POST /auth/login
→ Passport LocalStrategy triggered:
  1. Query DB: queries.findUserByEmail(email)
  2. Check user exists: if (!user) → "User not found"
  3. Check user has salt: if (!user.salt) → "You've registered through a different login method"
     ^ THIS IS THE PROBLEM FOR ISSUE #6
  4. Hash submitted password with stored salt
  5. Compare hashes: crypto.timingSafeEqual(storedHash, submittedHash)
  6. On match: serializeUser(user.id) → stored in session cookie
  7. Subsequent requests: deserializeUser(id) → fetches user from DB
```

### Key Points
- Each user has **unique salt** (16 random hex bytes)
- Hash iterations: **310,000** (slow by design for security)
- Comparison: **timing-safe** to prevent timing attacks
- Session: Stores only user.id in encrypted cookie; full user fetched on each request

## Google OAuth Workflow

### Setup
Located in `auth-config/passportGoogleAuthsetup.js`:
- Redirects to Google consent screen at `/auth/google`
- Google redirects back to callback URL with authorization code
- Strategy exchanges code for user profile info
- Creates or finds user by Google ID

### User Creation/Lookup
```
Google callback
→ Strategy checks: findUserByGoogleId(googleId)
  1. If user exists by googleId: use existing user
  2. If user does NOT exist: create new user with googleId + profile info
  3. NO email matching/account linking logic
  4. New user stored: { googleId, displayName, email, profilePhoto, ... }
     Note: NO salt or hashedPassword fields
```

### Issues with Current Implementation
None yet for Google-only flows, but see **CRITICAL BUGS** below.

## ✅ What Works

1. **Local account creation + login** - Users can create accounts with email/password and log in
2. **Google account creation + login** - Users can create accounts via Google and log in
3. **Session persistence** - Users stay logged in across requests (24 hour cookie expiry)
4. **Logout** - `req.logout()` clears session

## ❌ CRITICAL BUGS

### Issue #5: Local Account → Google OAuth

**Scenario**: 
1. User creates account locally with email `user@example.com` (gets salt + hashedPassword)
2. User tries to login with Google using same email

**Current Behavior**:
- Passport Google strategy looks for existing user by googleId (doesn't find one)
- Creates a NEW user entry with same email but googleId set
- User now has TWO accounts in database
- Second login always creates duplicate account

**Root Cause**:
- Google strategy only checks `findUserByGoogleId(googleId)`
- No logic to merge/link accounts by email

**Solution Options**:
1. **Account Linking** (recommended):
   - On Google callback, check if user with same email exists
   - If local user found: Link Google ID to existing account (add googleId field)
   - User can then login via either method

2. **Prevent Duplicate**:
   - On Google callback, check email exists locally
   - Prompt user: "This email already has a local account. Link them?"
   - Require password verification before linking

3. **Single Auth Method**:
   - On Google callback, reject if email already exists locally
   - Force user to use their original login method

**Fix Location**: `auth-config/passportGoogleAuthsetup.js` - Google strategy callback

### Issue #6: Google Account → Local Login

**Scenario**:
1. User creates account via Google (no salt or hashedPassword)
2. User tries to login with email/password on local login page

**Current Behavior**:
- LocalStrategy finds user by email
- Checks `if (!user.salt)` → rejects with "You've registered through a different login method"
- User cannot use local login method

**Root Cause**:
- LocalStrategy is defensive: rejects users without salt field
- This prevents accidental password usage on Google-only accounts
- But prevents intentional account linking

**Solution Options**:
1. **Account Linking**:
   - During local login attempt on Google-only account:
   - Verify they want to add local password to existing account
   - Require credential validation (e.g., re-authenticate with Google first)
   - Add salt + hashedPassword to existing user document

2. **UI Guidance**:
   - Catch the "different login method" error
   - Show user: "This account uses Google login. Use Google to login instead"
   - Button: "Login with Google" instead

3. **Auto-Linking** (not recommended):
   - Automatically add local password to Google-only accounts
   - Security risk: attacker could add password to someone else's Google account

**Fix Location**: `auth-config/passportLocalSetup.js` - Strategy callback or `routes/auth.js` - error handler

## Implementation Guidelines

### When Adding New Auth Features
1. **Dual-method accounts require merging logic**
   - Check email on both strategies
   - Link by adding fields to existing user document
   - Ensure serializeUser/deserializeUser work with both fields

2. **Session Management**
   - `serializeUser(user, done)` - called on login, stores user.id in session
   - `deserializeUser(id, done)` - called on each request, fetches user from DB
   - Both must work with merged local + Google accounts

3. **Testing with WebdriverIO**
   - Test page objects in `/test/e2e/pageobjects/`
   - Test specs in `/test/e2e/specs/`
   - Must cover both local + Google flows separately
   - Must cover account-linking flows after fixes

### Password Security Checklist
- [ ] Using `crypto.pbkdf2()` with 310,000 iterations
- [ ] Generating unique salt per user
- [ ] Using `crypto.timingSafeEqual()` for comparison
- [ ] Never logging passwords
- [ ] Validating input with express-validator

## Related Code
- `database/queries.js` - User lookup functions (findUserByEmail, findUserById, etc.)
- `controllers/authController.js` - postCreateAccount middleware
- `routes/auth.js` - Route handlers for /auth/login, /auth/create-account, /auth/logout
