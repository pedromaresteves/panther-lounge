// database/migrations/001_search_field_indexes.js
// Search field indexes for improved search performance
db.songs.createIndex({ artistSearch: 1 });
db.songs.createIndex({ titleSearch: 1 });
db.songs.createIndex({ artistSearch: 1, titleSearch: 1 });

// Other recommended indexes from IMPROVEMENTS.md
// Note: Keeping indexes on original fields for display/sorting purposes
db.songs.createIndex({ artist: 1 });
db.songs.createIndex({ songCreator: 1 });