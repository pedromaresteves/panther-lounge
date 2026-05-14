import chordsDb from '../guitar_chords_db/index.js';
import chordsDbToVexChords from '../transforms/chordsDbToVexChords.js';

// Preload all chords (optional: lazy-load if performance is a concern)
const chordCache = {};

async function loadChord(key, suffix) {
  if (chordCache[`${key}_${suffix}`]) {
    return chordCache[`${key}_${suffix}`];
  }

  try {
    const chordModule = await import(`../guitar_chords_db/chords/${key}/${suffix}.js`);
    chordCache[`${key}_${suffix}`] = chordModule.default;
    return chordModule.default;
  } catch (error) {
    throw new Error(`Chord ${key}${suffix} not found`);
  }
}

async function getChord(root, suffix, variationIndex = 0) {
  // Normalize root and suffix
  const normalizedRoot = chordsDb.keys.includes(root) ? root : 'C';
  const normalizedSuffix = chordsDb.suffixes.includes(suffix) ? suffix : 'major';

  const chord = await loadChord(normalizedRoot, normalizedSuffix);
  return chordsDbToVexChords(chord, variationIndex);
}

export default getChord;