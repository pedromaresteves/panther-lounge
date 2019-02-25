const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const SongSchema = new Schema({
    artist: String,
    title: String,
    lyricsChords: String
});

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;