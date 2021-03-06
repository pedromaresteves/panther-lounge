const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const SongSchema = new Schema({
    artist: String,
    title: String,
    lyricsChords: {},
    nArtist: String,
    nTitle: String,
    songCreator: String
});

//The nArtist and nTitle Fields refer to a normalize version of the respective values

const Song = mongoose.model("Song", SongSchema);

module.exports = Song;