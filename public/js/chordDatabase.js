// Client-side chord database module
let guitarChordsDb = require('../../guitar_chords_db/index.js');

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
        // Lazily load database from window if not already loaded
        if (!guitarChordsDb && typeof window !== 'undefined' && typeof window.chordDatabaseBrowser !== 'undefined') {
            guitarChordsDb = window.chordDatabaseBrowser;
        }
        
        // Check if database is loaded
        if (!guitarChordsDb) {
            console.warn('findChordPositions: Database not loaded yet');
            return [];
        }
        
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
 * Convert guitar_chords_db position format to SVGuitar format
 * @param {Object} position - Position object from database (frets, fingers, barres)
 * @param {string} title - Chord name to display (e.g., 'Am', 'C')
 * @returns {Object} SVGuitar-compatible chord object
 */
function convertPositionToSvguitarFormat(position, title) {
    if (!position || !position.frets) {
        return null;
    }

    const frets = position.frets.split('');
    const fingers = position.fingers ? position.fingers.split('') : [];

    // SVGuitar expects strings in order: 1=high E, 2=B, 3=G, 4=D, 5=A, 6=low E
    // Database stores strings as: low E, A, D, G, B, high E — reverse
    const reversedFrets = frets.slice().reverse();
    const reversedFingers = fingers.slice().reverse();

    // Calculate position: minimum non-x, non-0 fret
    const actualFrets = reversedFrets
        .filter(f => f !== 'x' && f !== '0')
        .map(f => parseInt(f, 10));
    const minFret = actualFrets.length > 0 ? Math.min(...actualFrets) : 1;

    // If position > 1, all frets are relative to position
    // (diagram fret = actual fret - minFret + 1)
    // If there are open strings mixed with fretted strings, use position 1
    const hasOpen = reversedFrets.some(f => f === '0');
    const hasFretted = actualFrets.length > 0;
    const svgPosition = (hasOpen && hasFretted) ? 1 : minFret;

    // Build finger array
    const svgFingers = reversedFrets.map((fret, i) => {
        const stringNum = i + 1;
        if (fret === 'x') {
            return [stringNum, 'x'];
        }
        const actualFret = parseInt(fret, 10);
        let diagramFret;
        if (actualFret === 0) {
            diagramFret = 0;
        } else if (svgPosition <= 1) {
            diagramFret = actualFret;
        } else {
            diagramFret = actualFret - svgPosition + 1;
        }
        const fingerLabel = reversedFingers[i];
        if (fingerLabel && fingerLabel !== '0') {
            return [stringNum, diagramFret, fingerLabel];
        }
        return [stringNum, diagramFret];
    });

    const result = {
        fingers: svgFingers,
        barres: [],
        position: svgPosition,
        title: title || ''
    };

    return result;
}

// Export for use in tooltip.js
module.exports = {
    findChordPositions,
    parseChordName,
    convertPositionToSvguitarFormat,
    normalizeRoot
};