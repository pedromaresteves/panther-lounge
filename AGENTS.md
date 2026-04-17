# Panther Lounge - AI Agent Guide

## 🎯 Purpose
This file provides essential guidance for working effectively with AI agents on the Panther Lounge project. For detailed information, reference the files in `.agents/`.

## 🔑 Role System
Every AI response should start with `[ROLE: Default/Developer/QA]`:
- **Default/Code**: General implementation (feature work, bug fixes)
- **Developer**: Full-stack focus on quality, security, architecture
- **QA**: Testing focus, bug identification, edge cases

To switch roles: "Switch to developer mode" etc.

## 🚀 Quick Start for AI
When asking for help, reference these files in `.agents/`:
1. **[`.agents/context.md`**](.agents/context.md) — Project overview, tech stack, known issues
2. **[`.agents/instructions/auth.instructions.md`**](.agents/instructions/auth.instructions.md) — Auth patterns, OAuth flows, bugs #5 & #6
3. **[`.agents/instructions/database.instructions.md`**](.agents/instructions/database.instructions.md) — MongoDB queries, schemas
4. **[`.agents/instructions/controllers.instructions.md`**](.agents/instructions/controllers.instructions.md) — Request/response patterns
5. **[`.agents/copilot-instructions.md`**](.agents/copilot-instructions.md) — Coding conventions, testing approach

## 📋 Common Task Prompts
Use these patterns when requesting AI assistance:

**Add Route + Controller**: 
"Add a new route `/api/user-stats` that returns user statistics. Follow patterns in database and API controller instructions."

**Fix Auth Issues**:
"Help me fix issue #5: local account → Google login should link accounts, not create duplicates."

**Add Database Query**:
"I need a query to find songs by artist name. Add it to the database module and export it using normalized search fields."

**Write E2E Tests**:
"Write end-to-end tests for the account-linking feature. Test local→Google and Google→local scenarios."

## ⚠️ Critical Requirements
AI must always follow these security and quality practices:
- Use `crypto.pbkdf2()` with 310,000 iterations for password hashing
- Use `crypto.timingSafeEqual()` for password comparison
- Check `req.isAuthenticated()` before accessing user data
- Validate input with express-validator
- Never log passwords
- Compare ObjectIds with `.toString()` for authorization checks
- For search: use `artistSearch`/`titleSearch` fields, display from original `artist`/`title`

## 🏗️ Code Organization
When adding features:
1. Route in `/routes/`
2. Controller logic in `/controllers/`  
3. Database queries in `/database/`
4. Views in `/views/`
5. Frontend JS in `/public/js/` (run `npm run webpackBuild`)
6. Tests in `/test/e2e/`

## ✅ Before Asking AI
1. Clarify: "Add feature X" vs "Fix bug Y" vs "Explain how Z works"
2. Point to affected files: "In `authController.js`..." or "In `/api/songs` endpoint..."
3. Reference issues: "Fix issue #5" or "Follow database patterns"
4. Describe expected behavior: "After login, user should be redirected to..."

## 🔄 Feedback Loop
After AI completes work:
1. Review changes against instruction files
2. Test locally with `npm run startNodemon`
3. Run E2E tests with `npm run wdio`
4. Report issues with specific error messages

---
**Last Updated**: April 17, 2026
**Project**: Panther Lounge (Guitar Chords App)
**Tech Stack**: Node.js, Express, EJS, MongoDB, Passport.js, WebdriverIO