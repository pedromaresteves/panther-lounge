const fs = require('fs');
const path = require('path');

// Use dynamic imports for ES modules
const importESModule = async (filePath) => {
  const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
  const module = await import(fileUrl);
  return module.default;
};

// Paths
const chordsDir = path.join(__dirname, '../guitar/chords');
const outputPath = path.join(__dirname, '../public/data/chords-vexchords.json');

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Verify chords directory exists
if (!fs.existsSync(chordsDir)) {
  console.error(`Error: Chords directory not found at ${chordsDir}`);
  process.exit(1);
}
const output = {};

// Helper: Convert fret string to array (e.g., 'x02220' → [-1, 0, 2, 2, 2, 0])
function parseFrets(fretString) {
  return fretString.split('').map((char) => {
    if (char === 'x') return -1;
    if (char === '0') return 0;
    if (/[a-f]/.test(char)) return parseInt(char, 16); // Handle hex (e.g., 'a' → 10)
    return parseInt(char, 10);
  });
}

// Helper: Convert finger string to array (e.g., '001230' → [0, 0, 1, 2, 3, 0])
function parseFingers(fingerString) {
  return fingerString.split('').map((char) => parseInt(char, 10));
}

// Convert chords to VexChords format
async function convertChords() {
// Iterate through keys (A, Bb, B, etc.)
const keys = fs.readdirSync(chordsDir);
for (const keyDir of keys) {
  const keyPath = path.join(chordsDir, keyDir);
  if (!fs.statSync(keyPath).isDirectory()) continue;
  
  // Iterate through chord files (e.g., _Ab.js, major.js)
  const chordFiles = fs.readdirSync(keyPath);
  for (const chordFile of chordFiles) {
    if (!chordFile.endsWith('.js') || chordFile === 'index.js') continue;
    
    const chordPath = path.join(keyPath, chordFile);
    let chordData;
    try {
      chordData = await importESModule(chordPath);
    } catch (err) {
      console.error(`Error importing ${chordPath}:`, err.message);
      continue;
    }
    
    // Extract key and suffix
    const key = chordData.key;
    const suffix = chordData.suffix || path.basename(chordFile, '.js').replace('_', '');
    
    // Initialize key/suffix in output if missing
    if (!output[key]) output[key] = {};
    if (!output[key][suffix]) output[key][suffix] = [];
    
    // Transform each position
    if (!chordData.positions || !Array.isArray(chordData.positions)) {
      console.error(`Invalid chord data in ${chordPath}: missing or invalid 'positions'`);
      continue;
    }
    
    chordData.positions.forEach((position) => {
      if (!position.frets) {
        console.error(`Invalid position data in ${chordPath}: missing 'frets'`);
        return;
      }
      
      const vexChord = {
        frets: parseFrets(position.frets),
        fingers: position.fingers ? parseFingers(position.fingers) : [],
        barres: Array.isArray(position.barres) ? position.barres : [position.barres].filter(Boolean),
        capo: position.capo || false,
      };
      output[key][suffix].push(vexChord);
    });
  }
}
  
  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`VexChords-compatible chords saved to ${outputPath}`);
}

// Run the conversion
convertChords();

// Write output
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(`VexChords-compatible chords saved to ${outputPath}`);