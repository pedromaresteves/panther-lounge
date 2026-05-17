const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const apiController = require("../controllers/apiController");
const Chord = require("../database/models/Chord");

router.get("/guitar-chords", jsonParser, apiController.paginationArtists);
router.get("/guitar-chords/get-all-results", jsonParser, apiController.getAllResults);
router.get("/profile", jsonParser, apiController.profileSongs);
router.get("/guitar-chords/:artist", jsonParser, apiController.paginationSongsByArtist);
router.post("/guitar-chords/add-song/:artist?", jsonParser, apiController.addSong);
router.post("/guitar-chords/edit-song/:artist/:title", jsonParser, apiController.editSong);
router.delete("/guitar-chords/:artist/:title", jsonParser, apiController.deleteSong);

// Get chord by name
router.get("/chords/:chordName", async (req, res) => {
  try {
    // Try to fetch from database first
    const chord = await Chord.findByName(req.params.chordName);
    
    if (chord) {
      res.json(chord);
    } else {
      // Fallback: Load from @guitar_chords_db
      try {
        // Import the guitar_chords_db dynamically
        const guitarChordsDb = require('../guitar_chords_db/index.js');
        const [root, suffix] = parseChordName(req.params.chordName);
        
        // Find the chord in the database
        const chordData = findChordInDb(guitarChordsDb.default || guitarChordsDb, root, suffix);
        
        if (chordData) {
          res.json({
            key: root,
            suffix: suffix,
            positions: chordData.positions || []
          });
        } else {
          res.status(404).json({ error: "Chord not found" });
        }
      } catch (dbError) {
        console.error("Error loading from guitar_chords_db:", dbError);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Error fetching chord:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Helper function to parse chord name
function parseChordName(chordName) {
  // Handle slash chords (e.g., "Am/G")
  const slashMatch = chordName.match(/^([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|\d)?[#b\d\/]*)\/([A-G][#b]?)$/);
  
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
  if (suffix === 'maj') suffix = 'major';
  else if (suffix === 'min') suffix = 'minor';
  else if (suffix === 'm') suffix = 'minor';
  suffix = suffix || 'major';
  return [root, suffix];
}

// Helper function to find chord in guitar_chords_db
function findChordInDb(db, root, suffix) {
  // Normalize root note (e.g., C# -> Csharp)
  const normalizedRoot = root.replace('#', 'sharp').replace('b', 'b');
  
  // Get the root object (e.g., db.chords.C)
  const rootObj = db.chords[normalizedRoot];
  
  if (!rootObj) {
    return null;
  }
  
  // Find the specific chord suffix in the root's chords array
  for (const chord of rootObj) {
    if (chord && chord.suffix === suffix) {
      return chord;
    }
  }
  
  return null;
}

module.exports = router;