---
name: pr-review
description: Score a branch vs base on Safety, Best practices, Tests, Deploy (1-5 each) with file evidence and Block/Ship/Merge verdict
---

## What I do
Evaluate `base...head` diff on 4 dimensions, each 1-5 with `file:line` evidence. Verdict: any `<3` = Block merge + re-review, all `=3` = Ship with notes, all `>3` = Mergeable.

## When to use me
PR / pre-merge review in Panther Lounge. Run read-only via `@qa-reviewer` (`edit: deny`). Never read `.env`, never edit code.

## Scope (branch-only, enforced)
- Review ONLY files in `git diff base...head --name-only`. Ignore `node_modules/`, `*.env`.
- Evidence MUST cite a changed `file:line` from that diff. Pre-existing project issues (old test failures, stale docs elsewhere, unrelated routes) go under `Out of scope notes`, never lower a score.
- Only lower a score if a touched file introduces the risk or breaks a directly dependent route/query. Docs-only renames score D4 ≤3 unless runtime `curl`/boot proof for touched routes is provided as input.
- If runtime evidence (`npm start` log, `curl -w "%{http_code}"`, `npm run test` tail) is pasted in chat, accept it for D3/D4 for touched routes only.

## Inputs
- `base...head` range, e.g. `master...experiment`. Default: `master...HEAD`.
- Steps: `git diff base...head --stat`, then full diff for changed files only. Ignore `node_modules/`, `*.env`.

## Dimensions and anchors

### D1 Safety (privacy, secrets, auth)
- 1 = secrets leaked (`.env`, tokens in diff/logs), auth bypass, plaintext passwords, `timingSafeEqual` missing where needed.
- 3 = poor hygiene but no direct exploit (verbose errors, missing rate-limit, overly broad query).
- 5 = no risks: `req.isAuthenticated()` + ownership checks, `express-validator`, `pbkdf2(310k)` + `timingSafeEqual`, no PII in logs.

### D2 Code best practices (readability, layers, Express 5)
- 1 = wrong layer (Mongo in controller), copy-paste, unreadable, Express 4 syntax (`:param?`, `/*`, `body-parser`).
- 3 = works but inefficient/unreadable (N+1, no `Promise.all`, vague names).
- 5 = `routes→controllers→queries`, single-responsibility, Express 5 `/{:param}` + `/*splat` + `express.json()`, matches file conventions.

### D3 Test and verification (proof it works)
- 1 = no evidence, breaks `npm run test` / `npm run wdio`.
- 3 = manual boot/curl only (`npm start` + key routes 200), no new tests, reason stated.
- 5 = unit + E2E green or explicit why-not, positive/negative/boundary covered, fixtures cleaned.

### D4 Deploy and regression (Render-safe)
- 1 = crashes boot, breaks existing route, migration without rollback.
- 3 = boots but risky (trailing slash, env rename, static/dotfiles, MIME change).
- 5 = boot + `Mongo OK` + key routes 200 (`/`, `/guitar-chords/`, `/add-song`, `/add-song/:artist`), Render-safe.

## Output (required)
Markdown table: `| Dimension | Score | Evidence (file:line) | Notes |`, then `Verdict: Block / Ship with notes / Mergeable` + top 3 risks + re-review scope. Invalid if any score lacks evidence. Keep brief, no filler.
