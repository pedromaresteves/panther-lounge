# AI Agent Instructions for Panther Lounge

## When Working on This Project

### 1. Always Reference the Context File First
Before suggesting changes, read `.agents/context.md` to understand:
- Project architecture and tech stack
- Folder structure and responsibilities
- Environment setup requirements

### 2. Authentication
When working on auth:
- Understand the difference between LocalStrategy and GoogleStrategy
- Know that users need a `salt` field for local login (Google-only users don't have it)
- Google-only users cannot log in with local strategy - gets rejected with "You've registered through a different login method"
- Reference `.agents/instructions/auth.instructions.md` for strategy patterns

### 3. Follow Established Patterns

**For routes**: Organize by feature in `/routes/` files and delegate to controllers.

**For controllers**: Keep request/response logic here; query logic goes to `/database/`.

**For database queries**: Never embed MongoDB logic in controllers; always use query helper from `/database/queries.js`.

**For views**: Use EJS templating with `res.render()` and pass data as context object.

**For frontend**: Bundle JavaScript through Webpack; run `npm run webpackBuild` after changes.

### 4. Testing Approach
- E2E tests in `/test/e2e/` test full user flows (login, account creation, song CRUD)
- Use WebdriverIO page objects for maintainability
- Run tests with `npm run wdio`

### 5. Security Reminders
- Use `crypto.pbkdf2()` with salt for any new password fields
- Always use `crypto.timingSafeEqual()` for password comparison
- Never log user passwords
- Validate all user input with express-validator

### 6. Project Conventions

**Naming**:
- Routes: kebab-case (`/guitar-chords`)
- Files: camelCase (`authController.js`)
- DB fields: camelCase (`hashedPassword`)

**Error Flow**:
- Passport errors: custom messages in strategy
- Validation errors: render view with error messages
- Uncaught errors: pass to `next(err)`

**Session**:
- Users stored in encrypted session cookies (24 hour maxAge)
- Always check `req.isAuthenticated()` before accessing profile data
- Use `req.user` to access current user (fetched fresh from DB on each request)

### 7. When Implementing Features
1. Add route in `/routes/`
2. Add controller logic in `/controllers/`
3. Add any DB queries needed in `/database/`
4. Create or update EJS view in `/views/`
5. Add frontend JS in `/public/js/` and rebuild with `npm run webpackBuild`
6. Update E2E tests in `/test/e2e/` if it's a user-facing flow

### 8. E2E Tests
Run all tests with `npm run wdio`. Current tests cover:
- createNewAccount.js - Account creation flow
- loginLocal.js - Local login flow
- loginGoogle.js - Google OAuth flow
- viewChords.js - Core navigation flow

Run a single test file:
```
npm run wdio -- --spec .\test\e2e\specs\createNewAccount.js
```
