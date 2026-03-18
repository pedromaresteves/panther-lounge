# Panther Lounge (Guitar Chords App)

A full-stack Node/Express guitar chords app with user authentication, profile/account management, song CRUD, search, and chord visualization.

## Project structure

- `app.js` - main Express server
- `routes/` - Express route handlers (`index`, `auth`, `profile`, `api`, `guitarChords`)
- `controllers/` - controller logic for view rendering and API actions
- `database/` - MongoDB connection + query helper modules
- `views/` - EJS templates for UI pages
- `public/` - static assets for styles/scripts
- `auth-config/` - Passport authentication setup (Google + local)
- `test/e2e/` - WebdriverIO end-to-end tests
- `utils/` - utility helpers

## Features

- Local account creation + login (email/password)
- Google OAuth login
- Profile page with saved songs and preferences
- Add/Edit/Delete song entries with chords and metadata
- Search/filter songs (client-side + server-side)
- Chord generation helper using `fuse.js` and custom chord logic
- Webpack build pipeline for frontend bundle
- E2E test suite via WebdriverIO (`wdio`)

## Prerequisites

- Node.js 18+ (recommended)
- npm
- MongoDB running locally (or Atlas URI)

## Setup

1. Clone repo:
   ```bash
   git clone <repo-url>
   cd panther-lounge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` with required vars:
   - `MONGO_URI` (e.g., mongodb://localhost:27017/panther)
   - `SESSION_SECRET`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if using Google OAuth)
   - `GOOGLE_CALLBACK_URL` (if using Google OAuth)
   Follow `.env.example` as a template.

4. Start local MongoDB if not already running.

## Run

- Development server:
  ```bash
  npm run startNodemon
  ```
- Production mode:
  ```bash
  npm start
  ```

- Build frontend bundle:
  ```bash
  npm run webpackBuild
  ```

- Execute tests:
  ```bash
  npm run wdio
  ```

## Usage

- Visit `http://localhost:3000` (or configured port).
- Register new account or login with Google/local.
- Add/edit songs from UI screens.
- Use search bar and filters on songs list.

## Code pointers

- Auth flow: `auth-config/passportLocalSetup.js`, `auth-config/passportGoogleAuthsetup.js`, `routes/auth.js`.
- Mongo queries: `database/queries.js` and `database/profile_queries.js`.
- Frontend logic: `public/js/*.js` + `webpack.config.js`.

## Troubleshooting

- `EADDRINUSE`: stop running app from previous session or change port in `app.js`.
- Mongo connection errors: verify `MONGO_URI` and Mongo daemon status.
- Google OAuth errors: verify callback URL and client secrets.

## License

ISC
