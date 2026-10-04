# Auth Manual Tests (Google-dependent)

These flows need a real Google account + OAuth consent, so they can't run in
`wdio` automation. Run against a dev server (`npm start`, port 5000) with
DevTools Network tab on **Preserve log**. Clean up fixture users afterwards
via Mongo (`db.users.deleteOne({email: "..."})`) or `queries.deleteUser`.

## T-US1: Google signup + repeat Google login

1. In a fresh profile (or after `Logout`), open `/auth/login` → Google → pick a Gmail never used here → consent.
2. Expect: lands on `/profile/`, one `users` doc with that email + `googleId`, no `salt`.
3. Log out, repeat Google login with the same Gmail.
4. Expect: lands on `/profile/`, still exactly one doc for that email.

## T-US3: Local account, later Google login (verified auto-link)

1. Create a local account at `/auth/create-account` using **your real Gmail** + password. Log out.
2. `/auth/login` → Google → pick that same Gmail → consent.
3. Expect: lands on `/profile/` (no `?link=required`), and the doc now has BOTH `salt`/`hashedPassword` AND `googleId` — one doc total for the email.
4. Regression check: password login with the original password still works.

## T-US5: Second Google account reuses an email (must refuse)

Setup is hard without two Google identities sharing one address — closest proxy:
1. Pick a linked email (has both `salt` and `googleId: G1`).
2. If you control a second Google account, point its profile email at the same address (e.g. Google Workspace alias) and log in with it.
3. Expect: lands on `/auth/login/?link=required`, doc keeps `googleId: G1` (no overwrite), no new doc.
4. Without a second identity, verify by review: `passportGoogleAuthsetup.js` refuses when `googleId` differs.

## T-US6: Unverified Google email (must refuse)

Hard to trigger — Google sets `email_verified: true` for Gmail. If you have a
non-Gmail Google account with an unverified address:
1. Google-login with it.
2. Expect: lands on `/auth/login/?link=required`, no doc created/changed.

## Cleanup

Delete fixture users after each run. Never run these against production data.
