# Panther Lounge - AI Agent Guide

This file documents how to work effectively with AI agents (GitHub Copilot, Claude, etc.) on the Panther Lounge project.

## Quick Start for AI

When asking AI for help on this project, reference these files in `.agents/`:

1. **Start here**: [`.agents/context.md`](.agents/context.md) — Project overview, architecture, tech stack, known issues
2. **Working on Auth?**: [`.agents/instructions/auth.instructions.md`](.agents/instructions/auth.instructions.md) — Passport patterns, OAuth flows, critical bugs #5 & #6
3. **Working on Database?**: [`.agents/instructions/database.instructions.md`](.agents/instructions/database.instructions.md) — MongoDB queries, collection schemas, usage patterns
4. **Working on Controllers?**: [`.agents/instructions/controllers.instructions.md`](.agents/instructions/controllers.instructions.md) — Request/response patterns, error handling, authorization
5. **General Instructions**: [`.agents/copilot-instructions.md`](.agents/copilot-instructions.md) — Coding conventions, testing approach, when to reference what

## Common Tasks & AI Prompts

### Adding a New Route + Controller

**AI Prompt**: "Add a new route `/api/user-stats` that returns user statistics (song count, total chords learned, etc.). Follow the patterns in the database and API controller instructions."

**What AI Will Do**:
- Create route in `routes/api.js`
- Add controller function in `controllers/apiController.js`
- Reference query helpers from `database/queries.js`
- Return JSON with proper error handling

**Files AI Will Reference**:
- `.agents/instructions/controllers.instructions.md` → CRUD endpoint patterns
- `.agents/instructions/database.instructions.md` → Query functions
- `.agents/context.md` → Project structure

### Fixing Authentication Issues

**AI Prompt**: "Help me fix issue #5: users who create a local account should be able to link their Google account to the same user record. Prevent duplicate accounts."

**What AI Will Do**:
- Review auth flows in `auth-config/`
- Suggest database schema changes (add googleId to local users)
- Implement account-linking logic in passport callback
- Update E2E tests if needed

**Files AI Will Reference**:
- `.agents/instructions/auth.instructions.md` → Root causes and solution options
- `.agents/instructions/database.instructions.md` → User schema and linking queries
- `.agents/context.md` → Known issues section

### Adding Database Query

**AI Prompt**: "I need a new query to find songs by artist name. Add it to the database module and export it."

**What AI Will Do**:
- Add query to `database/song_queries.js`
- Export from `database/queries.js`
- Follow PBKDF2/ObjectId patterns from existing queries
- Include error handling

**Files AI Will Reference**:
- `.agents/instructions/database.instructions.md` → Query patterns, how to add new queries
- `.agents/context.md` → Collection schemas

### Writing E2E Tests

**AI Prompt**: "Write end-to-end tests for the new account-linking feature. Test local→Google and Google→local scenarios."

**What AI Will Do**:
- Create page objects in `test/e2e/pageobjects/`
- Create specs in `test/e2e/specs/`
- Follow WebdriverIO patterns
- Test both success and failure cases

**Files AI Will Reference**:
- `.agents/instructions/controllers.instructions.md` → Testing approach section
- `.agents/context.md` → Testing infrastructure

### Debugging Login Issues

**AI Prompt**: "User reports they can't login with their local password after creating a Google account. What's happening and how do I fix it?"

**What AI Will Do**:
- Explain issue #5: accounts aren't linked
- Walk through Passport flow to show why duplicate accounts are created
- Suggest fixes with code examples
- Provide migration strategy for existing duplicate accounts

**Files AI Will Reference**:
- `.agents/instructions/auth.instructions.md` → Issues #5 & #6, detailed explanations
- `.agents/context.md` → Known issues checklist

## Critical Knowledge for AI

### Issues #5 & #6 (Account Linking)

**Issue #5**: Local account → Google login creates duplicate account
- Root cause: Google strategy doesn't check for existing email
- Solution: Check email on Google callback, link if exists

**Issue #6**: Google account → Local login rejected
- Root cause: LocalStrategy rejects users without `salt` field
- Solution: Allow account linking or provide UI guidance

**Action**: When implementing auth features, always reference `.agents/instructions/auth.instructions.md` for these solutions.

### Security Requirements

AI must always:
- Use `crypto.pbkdf2()` with 310,000 iterations for password hashing
- Use `crypto.timingSafeEqual()` for password comparison
- Check `req.isAuthenticated()` before accessing user data
- Validate input with express-validator
- Never log passwords
- Compare ObjectIds with `.toString()` for authorization checks

Reference: `.agents/instructions/auth.instructions.md` under "Implementation Guidelines" and `.agents/instructions/controllers.instructions.md` under "Authorization Pattern"

### Database Patterns

When working with database queries:
- Always use query helpers from `database/queries.js`
- Never construct MongoDB queries in controllers
- Handle ObjectId conversion properly (`new ObjectId()`)
- Check user ownership before allowing edits (e.g., `song.userId === req.user._id`)

Reference: `.agents/instructions/database.instructions.md`

### Code Organization

When adding new features:
1. Route in `/routes/`
2. Controller logic in `/controllers/`
3. Database queries in `/database/`
4. Views in `/views/`
5. Frontend JS in `/public/js/` (then `npm run webpackBuild`)
6. Tests in `/test/e2e/`

Reference: `.agents/copilot-instructions.md` under "When Implementing Features"

## Before Asking AI for Help

1. **Clarify what you want**: "Add feature X" vs "Fix bug Y" vs "Explain how Z works"
2. **Point to affected files**: "In `authController.js`, when user..." or "In the `/api/songs` endpoint..."
3. **Reference the issue**: "Fix issue #5" or "Follow the database patterns"
4. **Describe expected behavior**: "After login, user should be redirected to..."

## Example: Complete Feature Request

```
I want to add a "Recently Played Songs" feature to the user profile.

Requirements:
- Track when user views/plays a song
- Show 10 most recent on profile page
- Update timestamp each time song is played

Follow these instructions:
1. Reference .agents/instructions/database.instructions.md for query patterns
2. Reference .agents/instructions/controllers.instructions.md for request handling
3. Add database query to track plays
4. Update profileController to fetch recent songs
5. Update profile.ejs to display them
6. Add E2E test for the feature
```

## File Structure

```
.agents/
├── context.md                          # Project overview & architecture
├── copilot-instructions.md             # AI working guidelines
└── instructions/
    ├── auth.instructions.md            # Passport & OAuth patterns + bugs
    ├── database.instructions.md        # MongoDB queries & schema
    └── controllers.instructions.md     # Request/response handling

AGENTS.md (this file)                   # Quick reference for AI + common tasks
README.md                               # General project documentation
```

## When NOT to Ask AI

- General JavaScript/Node.js questions → Use MDN or official docs
- How to use Passport (generic) → Use Passport.js docs
- How to install packages → Use npm docs
- Database design theory → Use MongoDB docs

**When TO Ask AI**:
- "How do I do [task] following Panther Lounge patterns?"
- "Add [feature] to the project"
- "Fix [bug #5 or #6]"
- "What's wrong with [code snippet]?"
- "Write E2E tests for [feature]"

## Feedback Loop

After AI completes work:
1. **Review changes** against the instruction files
2. **Test locally** with `npm run startNodemon`
3. **Run E2E tests** with `npm run wdio`
4. **Report issues** to AI with specific error messages or unexpected behavior

Example: "The new route throws 'Cannot read property _id of undefined' when user not authenticated. Check the authorization logic."

---

**Last Updated**: March 17, 2026
**Project**: Panther Lounge (Guitar Chords App)
**Tech Stack**: Node.js, Express, EJS, MongoDB, Passport.js, WebdriverIO
