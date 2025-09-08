const utils = require("../utils/utils");
const queries = require("../database/queries");

module.exports = {
  index: function (req, res) {
    let makeSongUrl = `guitar-chords/add-song`;
    res.render("guitarChords.ejs", { userData: req.user, makeSongUrl: makeSongUrl });
  },
  artistList: function (req, res) {
    let makeSongUrl = `guitar-chords/add-song/${utils.encodeChars(req.params.artist)}`;
    res.render("artistPage.ejs", { userData: req.user, makeSongUrl: makeSongUrl })
  },
  song: async function (req, res) {
    const artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
    const titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
    try {
      const song = await queries.getSong(artistRegex, titleRegex);
      song.lyricsChords = JSON.stringify(song.lyricsChords);
      if (song.songCreator) {
        const songCreatorData = await queries.findUserById(song.songCreator);
        song.songCreator = songCreatorData.username;
      }
      song.nArtist = utils.encodeChars(song.nArtist);
      return res.render("songs.ejs", { userData: req.user, songData: song });
    } catch (err) {
      return res.render("error.ejs", { userData: req.user, url: req.url, errorMessage: err.message });
    }
  },
  getAddSong: function (req, res) {
    const songData = {
      artist: req.params.artist,
      title: "",
      lyricsChords: undefined
    };
    res.render("addOrEditSong.ejs", { userData: req.user, songData: songData })
  },
  getEditSong: async function (req, res) {
    const artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
    const titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
    try {
      const song = await queries.getSong(artistRegex, titleRegex);
      song.lyricsChords = JSON.stringify(song.lyricsChords);
      return res.render("addOrEditSong.ejs", { userData: req.user, songData: song })
    } catch (err) {
      return res.render("error.ejs", { userData: req.user, url: req.url, errorMessage: err.message });
    }
  },
}