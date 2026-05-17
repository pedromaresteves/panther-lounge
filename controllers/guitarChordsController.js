const utils = require("../utils/utils");
const queries = require("../database/queries");

module.exports = {
  index: (req, res) => {
    const makeSongUrl = "guitar-chords/add-song";
    return res.render("guitarChords.ejs", { userData: req.user, makeSongUrl });
  },
  artistList: (req, res) => {
    const makeSongUrl = `guitar-chords/add-song/${utils.encodeChars(req.params.artist)}`;
    res.render("artistPage.ejs", { userData: req.user, makeSongUrl });
  },
  song: async (req, res) => {
    try {
      const artist = req.params.artist;
      const title = req.params.title;
      const song = await queries.getSong(artist, title);
      if (song.songCreator) {
        const songCreatorData = await queries.findUserById(song.songCreator);
        song.songCreator = songCreatorData.username;
      }
      song.artistURL = utils.encodeChars(utils.normalizeForUrl(song.artist));

      if (song.lyrics && song.lyrics.ops) {
        song.lyrics = song.lyrics.ops.map(op => op.insert).join('');
      }

      return res.render("songs.ejs", { userData: req.user, songData: song });
    } catch (err) {
      return utils.renderError(res, req, err);
    }
  },
  getAddSong: (req, res) => {
    const songData = {
      artist: req.params.artist,
      title: "",
      lyrics: ""
    };
    return res.render("addOrEditSong.ejs", { userData: req.user, songData });
  },
  getEditSong: async (req, res) => {
    try {
      const song = await queries.getSong(req.params.artist, req.params.title);
      return res.render("addOrEditSong.ejs", { userData: req.user, songData: song });
    } catch (err) {
      return utils.renderError(res, req, err);
    }
  }
};