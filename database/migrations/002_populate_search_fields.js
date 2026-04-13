// database/migrations/002_populate_search_fields.js
// Populate artistSearch and titleSearch from existing nArtist/nTitle fields
// Run once in migration

const normalizeForSearch = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '');

// Get all documents that have nArtist but not artistSearch
const cursor = db.songs.find({ artistSearch: { $exists: false }, nArtist: { $exists: true } });

let count = 0;
while (cursor.hasNext()) {
    const doc = cursor.next();
    db.songs.updateOne(
        { _id: doc._id },
        { $set: {
            artistSearch: normalizeForSearch(doc.nArtist),
            titleSearch: normalizeForSearch(doc.nTitle)
        }}
    );
    count++;
}

print(`Updated ${count} documents with search fields`);