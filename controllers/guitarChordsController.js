const utils = require("../utils/utils");
const queries = require("../database/queries");

module.exports = {
  index: (req, res) => {
    const makeSongUrl = "guitar-chords/add-song";
    res.render("guitarChords.ejs", { userData: req.user, makeSongUrl });
  },
  artistList: (req, res) => {
    const makeSongUrl = `guitar-chords/add-song/${utils.encodeChars(req.params.artist)}`;
    res.render("artistPage.ejs", { userData: req.user, makeSongUrl });
  },
  song: async (req, res) => {
    try {
      const artistRegex = utils.createCaseInsensitiveRegex(req.params.artist);
      const titleRegex = utils.createCaseInsensitiveRegex(req.params.title);
      const song = await queries.getSong(artistRegex, titleRegex);
      song.lyricsChords = JSON.stringify(song.lyricsChords);
      if (song.songCreator) {
        const songCreatorData = await queries.findUserById(song.songCreator);
        song.songCreator = songCreatorData.username;
      }
      song.nArtist = utils.encodeChars(song.nArtist);
      return res.render("songs.ejs", { userData: req.user, songData: song });
    } catch (err) {
      return utils.renderError(res, req, err);
    }
  },
  getAddSong: (req, res) => {
    const songData = {
      artist: req.params.artist,
      title: "",
      lyricsChords: undefined
    };
    res.render("addOrEditSong.ejs", { userData: req.user, songData });
  },
  getEditSong: async (req, res) => {
    try {
      const artistRegex = utils.createCaseInsensitiveRegex(req.params.artist);
      const titleRegex = utils.createCaseInsensitiveRegex(req.params.title);
      const song = await queries.getSong(artistRegex, titleRegex);
      song.lyricsChords = JSON.stringify(song.lyricsChords);
      return res.render("addOrEditSong.ejs", { userData: req.user, songData: song });
    } catch (err) {
      return utils.renderError(res, req, err);
    }
  }
};