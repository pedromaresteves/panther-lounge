const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const SongSchema = new Schema({
    title: String,
    lyricsChords: String
});

const ArtistSchema = new Schema({
    title: String,
    songs: [SongSchema]
});

const Artist = mongoose.model("ArtistManTest", ArtistSchema);

module.exports = Artist;