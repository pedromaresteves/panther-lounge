// database/migrations/002_user_indexes.js
// User collection indexes for email and Google authentication
// Run once in migration

db.collection('users').createIndex({ email: 1 }, { unique: true });
db.collection('users').createIndex({ googleId: 1 }, { unique: true, sparse: true });