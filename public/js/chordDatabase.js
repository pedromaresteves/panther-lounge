// Client-side chord database module
// Load the converted guitar_chords_db
const guitarChordsDb = require('../../guitar_chords_db/index.js');

/**
 * Normalize root note name for database lookup
 * @param {string} root - Root note (e.g., 'C#', 'Db')
 * @returns {string} Normalized root (e.g., 'Csharp', 'Db')
 */
function normalizeRoot(root) {
    return root.replace('#', 'sharp').replace('b', 'b');
}

/**
 * Parse chord name into root and suffix
 * @param {string} chordName - Full chord name (e.g., 'Em', 'C#m7')
 * @returns {[string, string]} [root, suffix]
 */
function parseChordName(chordName) {
    // Handle slash chords (e.g., "Am/G")
    const slashMatch = chordName.match(/^([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|\d)?[#b\d/]*)\/([A-G][#b]?)$/);
   
    if (slashMatch) {
        const mainChord = slashMatch[1];
        const rootMatch = mainChord.match(/^[A-G][#b]?/);
        const root = rootMatch ? rootMatch[0] : 'C';
        let suffix = mainChord.slice(root.length).replace('/' + slashMatch[2], '');
        suffix = suffix || 'major';
        return [root, suffix];
    }
   
    // Handle regular chords
    const rootMatch = chordName.match(/^[A-G][#b]?/);
    const root = rootMatch ? rootMatch[0] : 'C';
    let suffix = chordName.slice(root.length);
    
    // Normalize suffix
    suffix = suffix.replace('maj', 'major');
    suffix = suffix.replace('min', 'minor');
    suffix = suffix.replace('m', 'minor'); // Handle short form 'm'
    suffix = suffix || 'major';
   
    return [root, suffix];
}

/**
 * Find all positions for a given chord name
 * @param {string} chordName - Chord name to look up
 * @returns {Array} Array of position objects, or empty array if not found
 */
function findChordPositions(chordName) {
    try {
        const [root, suffix] = parseChordName(chordName);
        const normalizedRoot = normalizeRoot(root);

        // Get root object (e.g., guitarChordsDb.chords.C)
        const rootObj = guitarChordsDb.chords[normalizedRoot];

        if (!rootObj) {
            console.warn(`No chord data found for root: ${root}`);
            return [];
        }

        // Find all chords matching this suffix
        const matchingChords = rootObj.filter(chord =>
            chord && chord.suffix === suffix
        );

        if (matchingChords.length === 0) {
            console.warn(`No positions found for chord: ${chordName}`);
            return [];
        }

        // Return all positions from the first matching chord
        return matchingChords[0].positions || [];
        
    } catch (error) {
        console.error(`Error finding chord positions for ${chordName}:`, error);
        return [];
    }
}

/**
 * Convert guitar_chords_db position format to VexChords format
 * @param {Object} position - Position object from database
 * @returns {Object} VexChords-compatible chord object
 */
function convertPositionToVexFormat(position) {
    if (!position || !position.frets) {
        return null;
    }

    // Convert fret string to array format
    const frets = position.frets.split('');
    const fingers = position.fingers ? position.fingers.split('') : ['0','0','0','0','0','0'];

    // VexChords expects strings in order: 1=high E, 2=B, 3=G, 4=D, 5=A, 6=low E
    // Our database stores strings as: low E, A, D, G, B, high E
    // So we need to reverse the order
    return {
        chord: [
            [1, frets[5] === 'x' ? 'x' : parseInt(frets[5])], // String 1 = high E (last in original array)
            [2, frets[4] === 'x' ? 'x' : parseInt(frets[4])], // String 2 = B
            [3, frets[3] === 'x' ? 'x' : parseInt(frets[3])], // String 3 = G
            [4, frets[2] === 'x' ? 'x' : parseInt(frets[2])], // String 4 = D
            [5, frets[1] === 'x' ? 'x' : parseInt(frets[1])], // String 5 = A
            [6, frets[0] === 'x' ? 'x' : parseInt(frets[0])]  // String 6 = low E (first in original array)
        ],
        position: calculateVexPosition(frets)
    };
}

function calculateVexPosition(frets) {
    // Calculate position as the first non-zero fret (excluding 'x' for muted strings)
    // For VexChords, position should be 0 for open chords (where some strings are 0)
    // Only use non-zero position for barre chords where ALL played strings start at same fret
    
    // Check if this is an open chord (has both 0 and non-zero frets)
    let hasOpenStrings = false;
    let hasFrettedStrings = false;
    
    for (let i = 0; i < frets.length; i++) {
        if (frets[i] === '0') {
            hasOpenStrings = true;
        } else if (frets[i] !== 'x' && frets[i] !== '0') {
            hasFrettedStrings = true;
        }
    }
    
    // If it has both open and fretted strings, it's an open chord - position 0
    if (hasOpenStrings && hasFrettedStrings) {
        return 0;
    }
    
    // If all strings are either muted (x) or open (0), position is 0
    if (!hasFrettedStrings) {
        return 0;
    }
    
    // For barre chords (no open strings), find the first fret position
    for (let i = 0; i < frets.length; i++) {
        if (frets[i] !== 'x' && frets[i] !== '0') {
            return parseInt(frets[i]);
        }
    }
    
    return 0; // Fallback
}

// Export for use in tooltip.js
module.exports = {
    findChordPositions,
    parseChordName,
    convertPositionToVexFormat,
    normalizeRoot
};