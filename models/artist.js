const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema and Model
const SongSchema = new Schema({
    title: String,
    lyricsChords: String
});

const ArtistSchema = new Schema({
    name: String,
    songs: [SongSchema]
});


const Artist = mongoose.model("Artist", ArtistSchema);

module.exports = Artist;