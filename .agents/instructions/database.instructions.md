# Database Architecture & Query Patterns

## Overview
Panther Lounge uses MongoDB for all data persistence. Queries are centralized in `/database/` for maintainability and reusability.

## File Locations
- `database/mongodb_connection.js` - MongoDB client setup and connection
- `database/queries.js` - Main export combining all query helpers
- `database/profile_queries.js` - User profile CRUD functions
- `database/song_queries.js` - Song CRUD functions

## Database Setup

### Connection (`mongodb_connection.js`)
```javascript
const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);
// Connection established on server startup
```

### Required Environment Variable
- `MONGO_URI` - MongoDB connection string (e.g., `mongodb://localhost:27017/panther` or Atlas URI)

## Collections

### `users` Collection
Stores user accounts. Documents contain:
```javascript
{
  _id: ObjectId,
  
  // Local auth fields (only if registered locally)
  email: "user@example.com",
  username: "username",
  hashedPassword: "hex-string (PBKDF2)",
  salt: "hex-string (16 bytes)",
  
  // Google OAuth fields (only if registered via Google)
  googleId: "google-user-id",
  displayName: "User Name",
  profilePhoto: "https://...",
  
  // Common fields
  createdAt: ISODate,
  updatedAt: ISODate,
  preferences: { ... }
}
```

**Key Notes**:
- Local accounts have: email, username, hashedPassword, salt
- Google accounts have: googleId, displayName, profilePhoto
- Merged accounts have both (after fix for issues #5 & #6)

### `songs` Collection
Stores guitar song entries. Documents contain:
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to user who created/owns song
  
  title: "Song Title",
  artist: "Artist Name",
  key: "C", // Chord key
  tempo: 120,
  
  chords: [
    { position: 0, name: "C" },
    { position: 4, name: "G" },
    ...
  ],
  
  lyrics: "Song lyrics with chord markers",
  notes: "Personal notes or tips",
  isPublic: true, // Whether visible to other users
  
  createdAt: ISODate,
  updatedAt: ISODate
}
```

## Query Helper Functions

All functions are exported from `database/queries.js`. They're organized logically but exported as a flat Object.

### User Queries (from `profile_queries.js`)

**`findUserById(id)`**
```javascript
// Returns user document by _id
// Used in passport.deserializeUser() on every request
const user = await queries.findUserById(userId);
```

**`findUserByEmail(email)`**
```javascript
// Returns user document by email (case-insensitive search)
// Used in LocalStrategy during login
// Used to check if email already registered during signup
const user = await queries.findUserByEmail("user@example.com");
```

**`findUserByGoogleId(googleId)`**
```javascript
// Returns user document by googleId
// Used in Google OAuth strategy
const user = await queries.findUserByGoogleId(googleId);
```

**`createNewUser(userObj)`**
```javascript
// Inserts new user document
// Called after password hashing in postCreateAccount
await queries.createNewUser({
  email: "user@example.com",
  username: "username",
  hashedPassword: hexString,
  salt: saltHex
});
```

**`updateUser(userId, updateObj)`**
```javascript
// Updates user document fields
// Used to add preferences, link OAuth, update profile
await queries.updateUser(userId, {
  preferences: { theme: "dark" },
  displayName: "New Name"
});
```

### Song Queries (from `song_queries.js`)

**`findSongById(songId)`**
```javascript
// Returns single song by _id
const song = await queries.findSongById(songId);
```

**`findSongsByUserId(userId)`**
```javascript
// Returns array of all songs created by user
const userSongs = await queries.findSongsByUserId(userId);
```

**`findPublicSongs()`**
```javascript
// Returns array of all public songs (across all users)
// Used for global search/browse
const publicSongs = await queries.findPublicSongs();
```

**`createNewSong(songObj)`**
```javascript
// Inserts new song document
// userId must be included to associate with creator
await queries.createNewSong({
  userId: userId,
  title: "Song Title",
  artist: "Artist Name",
  key: "C",
  chords: [...],
  isPublic: true
});
```

**`updateSong(songId, updateObj)`**
```javascript
// Updates song document fields
await queries.updateSong(songId, {
  title: "New Title",
  key: "G",
  chords: [...]
});
```

**`deleteSong(songId)`**
```javascript
// Deletes song document
await queries.deleteSong(songId);
```

## Usage Patterns

### In Controllers
Always use query helpers; never construct MongoDB queries directly:

```javascript
// ✅ CORRECT - Use query helper
const user = await queries.findUserByEmail(email);

// ❌ WRONG - Direct MongoDB logic
const user = db.collection("users").findOne({ email: email });
```

### Error Handling
Query functions may throw connection errors. Controllers should handle:

```javascript
try {
  const user = await queries.findUserByEmail(email);
} catch (error) {
  console.error("DB error:", error);
  return next(error); // Pass to error handler
}
```

### With Express Routes
Flow: Route → Controller → Query Helper → Database

```javascript
// routes/profile.js
router.get("/", (req, res, next) => {
  profileController.getProfile(req, res, next);
});

// controllers/profileController.js
getProfile: async (req, res, next) => {
  try {
    const user = await queries.findUserById(req.user._id);
    res.render("profile.ejs", { user: user });
  } catch (error) {
    next(error);
  }
}
```

## ObjectId Conversion

MongoDB `_id` fields are ObjectId type. When comparing or storing:

```javascript
// From express request body (strings)
const songId = req.params.id; // "507f1f77bcf86cd799439011" (string)

// Convert to ObjectId if needed by query function
const { ObjectId } = require("mongodb");
const songIdObj = new ObjectId(songId);

// OR let query helper handle conversion
// (Most helpers should accept both string and ObjectId)
const song = await queries.findSongById(songId);
```

## Indexing

For production performance, add indexes to:
- `users.email` - Used in login flow (findUserByEmail)
- `users.googleId` - Used in OAuth flow
- `songs.userId` - Used to fetch user's songs
- `songs.isPublic` - Used to filter public songs

Add in MongoDB client setup:
```javascript
await db.collection("users").createIndex({ email: 1 });
await db.collection("users").createIndex({ googleId: 1 });
await db.collection("songs").createIndex({ userId: 1 });
await db.collection("songs").createIndex({ isPublic: 1 });
```

## Adding New Queries

When adding a new query function:
1. Add function to appropriate file (`profile_queries.js` or `song_queries.js`)
2. Export from that file: `module.exports = { functionName, ... }`
3. Import in `queries.js` and spread into main export
4. Use via `queries.functionName()` in controllers

Example:
```javascript
// database/profile_queries.js
const findUsersByPartialEmail = async (emailPrefix) => {
  const users = await db.collection("users").find({ 
    email: { $regex: `^${emailPrefix}`, $options: "i" } 
  }).toArray();
  return users;
};
module.exports = { findUsersByPartialEmail, ... };

// database/queries.js
const profileQueries = require("./profile_queries");
module.exports = { ...profileQueries, ...songQueries };
```

## Security Considerations

- **Never expose MongoDB connection string** in frontend code
- **Always validate user input** before passing to queries (use express-validator)
- **Always check `req.isAuthenticated()`** before accessing user-specific data
- **Check `req.user._id`** matches requested resource (prevent unauthorized access)
- **Hash passwords with PBKDF2** before storing (not in query layer; done in controller)

## Known Issues Related to Database

### Issue #5: Account Linking
When fixing, will need new query:
- `findUserByEmailOrGoogleId(email, googleId)` - Find existing user by either method
- `linkGoogleToLocalAccount(userId, googleId)` - Add googleId to existing local user

### Issue #6: Account Linking
Same as #5; need queries to support merging local + Google auth on same user document.
