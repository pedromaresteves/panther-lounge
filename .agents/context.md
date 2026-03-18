# Panther Lounge - Project Context

## Project Overview
A full-stack Node.js/Express application for sharing and searching guitar songs with chords. Users can create accounts, save songs with chord progressions, search for songs, and manage their music library.

## Tech Stack
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **View Engine**: EJS templates
- **Database**: MongoDB (local or Atlas)
- **Authentication**: Passport.js
  - Strategy 1: Local (email/password with PBKDF2 hashing via crypto.pbkdf2)
  - Strategy 2: Google OAuth 2.0
- **Session Management**: cookie-session
- **Frontend Build**: Webpack 5
- **Testing**: WebdriverIO (E2E tests)
- **Search**: fuse.js (client-side fuzzy search)
- **Validation**: express-validator

## Folder Structure & Responsibilities

### `/routes/`
Express route handlers organized by feature:
- `index.js` - Home, landing pages
- `auth.js` - Login/logout/account creation flows
- `profile.js` - User profile management
- `guitarChords.js` - Chord reference pages
- `api.js` - JSON API endpoints for frontend

### `/controllers/`
Business logic layer:
- `authController.js` - Auth flow handlers (login, logout, account creation)
- `profileController.js` - Profile view/edit logic
- `apiController.js` - API endpoint logic
- `guitarChordsController.js` - Chord reference logic

### `/database/`
MongoDB query helpers and connection:
- `mongodb_connection.js` - Mongo client setup
- `queries.js` - Exports all query helpers (combines profileQueries + songQueries)
- `profile_queries.js` - User profile CRUD operations
- `song_queries.js` - Song CRUD operations

### `/auth-config/`
Passport strategy setup:
- `passportLocalSetup.js` - Email/password strategy with PBKDF2 hashing
- `passportGoogleAuthsetup.js` - Google OAuth strategy

### `/views/`
EJS templates for rendering UI:
- `loginLocal.ejs` - Local email/password login
- `createAccount.ejs` - Account creation form
- `profile.ejs` - User profile with saved songs
- `addOrEditSong.ejs` - Song form (add/edit)
- `songs.ejs` - Song list/search page
- `guitarChords.ejs` - Chord reference page
- `artistPage.ejs` - Artist-specific view
- `nav.ejs`, `footer.ejs` - Layout partials

### `/public/`
Static assets and frontend code:
- `/css/style.css` - Main stylesheet
- `/js/*.js` - Frontend scripts for interactivity
- `/js/bundle.js` - Webpack-compiled bundle

### `/test/e2e/`
End-to-end tests using WebdriverIO:
- `/pageobjects/` - Page object models for maintainability
- `/specs/` - Test specifications for login flows

## Known Issues & Testing Checklist
From `things-to-do.txt`:

### ✅ Completed Tests
1. Create account using Local login
2. Login Using Local Login
3. Create account Using Google Oauth
4. Login account using Google Oauth

### ❌ Critical Bugs to Fix

**Issue #5: User creates local account, then tries Google login**
- **Behavior**: System creates a NEW user entry instead of linking accounts
- **Root cause**: No account-linking logic; each strategy treats email independently
- **Required fix**: Detect existing user by email during OAuth callback and merge accounts

**Issue #6: User uses Google login, then tries local login**
- **Behavior**: LocalStrategy rejects with "You've registered through a different login method"
- **Root cause**: Google-only users have no `salt` field; LocalStrategy explicitly checks `if (!user.salt)`
- **Required fix**: Allow account linking or provide UI guidance to use original auth method

## Environment Variables Required
- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Secret key for cookie encryption
- `PORT` - Server port (default usually 3000)
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_CALLBACK_URL` - OAuth callback URL (typically `http://localhost:3000/auth/google/callback`)

## Scripts
- `npm start` - Run production server
- `npm run startNodemon` - Run dev server with auto-reload
- `npm run webpackBuild` - Build frontend bundle
- `npm run wdio` - Run E2E tests

## Coding Conventions

### Naming
- Routes: kebab-case (`/guitar-chords`, `/add-or-edit-song`)
- Files: camelCase (`authController.js`, `passportLocalSetup.js`)
- Database fields: camelCase (`hashedPassword`, `createdAt`)
- Route handlers: camelCase (`loginHome`, `postCreateAccount`)

### Error Handling
- Auth errors: Pass to Passport (custom messages in strategy)
- Validation errors: Use express-validator and pass to template via `res.render()`
- Data errors: Log and pass to `next(err)` for global error handler

### Session & Authentication
- Middleware: `req.isAuthenticated()` to check if user logged in
- Access user: `req.user` (populated by `passport.deserializeUser()`)
- Logout: `req.logout()` clears session
- Session storage: Uses encrypted cookies (no server-side store)

## Password Security
- Hashing: PBKDF2 with 310,000 iterations (strong, slow by design)
- Timing-safe comparison: `crypto.timingSafeEqual()` prevents timing attacks
- Salt: Unique 16-byte hex string per user
- Passwords: Never stored in plain text; only hash + salt stored
