# AI Agent Instructions for Panther Lounge

## When Working on This Project

### 1. Always Reference the Context File First
Before suggesting changes, read `.agents/context.md` to understand:
- Project architecture and tech stack
- Folder structure and responsibilities
- Known issues (#5 and #6 authentication bugs)
- Environment setup requirements

### 2. Authentication is Complex
This project has **two critical account-linking bugs**. When working on auth:
- Understand the difference between LocalStrategy and GoogleStrategy
- Know that users need a `salt` field for local login (Google-only users don't have it)
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
- Test checklist in `things-to-do.txt` tracks critical user journeys

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

### 8. For Bug Fixes (Issues #5 & #6)
See `.agents/instructions/auth.instructions.md` for detailed analysis and potential solutions.

## Quick Reference

| When You Need... | Look Here |
|---|---|
| Auth patterns | `.agents/instructions/auth.instructions.md` |
| Database patterns | `.agents/instructions/database.instructions.md` |
| Controller patterns | `.agents/instructions/controllers.instructions.md` |
| Full project overview | `.agents/context.md` |
| Environment setup | Check `.env` for required vars |
| Test status | `things-to-do.txt` |
