#!/usr/bin/env node

/**
 * Convert guitar_chords_db to browser-compatible format
 * This script creates a JSON file that can be loaded in the browser
 */

const fs = require('fs');
const path = require('path');

// Load the full database
const guitarChordsDb = require('../guitar_chords_db/index.js');

console.log('Converting guitar_chords_db for browser use...');
console.log('Database structure:', Object.keys(guitarChordsDb));

// Create a simplified structure for the browser
const browserDatabase = {
    chords: {}
};

// Process each root note
Object.keys(guitarChordsDb.chords).forEach(rootKey => {
    const rootChords = guitarChordsDb.chords[rootKey];
    
    if (Array.isArray(rootChords)) {
        browserDatabase.chords[rootKey] = rootChords.map(chord => {
            return {
                key: chord.key,
                suffix: chord.suffix,
                positions: chord.positions || []
            };
        });
    }
});

console.log('Processed', Object.keys(browserDatabase.chords).length, 'root notes');

// Count total chords and positions
let totalChords = 0;
let totalPositions = 0;
Object.keys(browserDatabase.chords).forEach(rootKey => {
    browserDatabase.chords[rootKey].forEach(chord => {
        totalChords++;
        totalPositions += chord.positions.length;
    });
});

console.log('Total chords:', totalChords);
console.log('Total positions:', totalPositions);

// Write to public/js directory
const outputPath = path.join(__dirname, '..', 'public', 'js', 'chordDatabaseBrowser.js');
const jsonOutput = `// Browser-compatible chord database
// Generated: ${new Date().toISOString()}
// Total chords: ${totalChords}, Total positions: ${totalPositions}

const chordDatabaseBrowser = ${JSON.stringify(browserDatabase, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = chordDatabaseBrowser;
}
`;

fs.writeFileSync(outputPath, jsonOutput, 'utf8');
console.log('✅ Database converted and saved to:', outputPath);
console.log('File size:', (jsonOutput.length / 1024).toFixed(2), 'KB');