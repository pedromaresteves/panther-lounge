const utils = require("../utils/utils");
const queries = require("../database/queries");

const RESULTS_PER_PAGE = 10;

const normalizeString = (str) =>
    str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

const getResultsToSkip = (pageNumber) =>
    !pageNumber ? 0 : (pageNumber - 1) * RESULTS_PER_PAGE;

const calculateNumOfPages = (totalResults) =>
    Math.ceil(totalResults / RESULTS_PER_PAGE);

const createSongUrl = (nArtist, nTitle) =>
    `/guitar-chords/${utils.encodeChars(nArtist)}/${utils.encodeChars(nTitle)}`;

module.exports = {
    profileSongs: async (req, res) => {
        const resultsToSkip = getResultsToSkip(req.query.page);
        const userId = req.user._id.toString();
        const [visibleResults, totalSongs] = await Promise.all([
            queries.getSongsBySongCreator(userId, resultsToSkip),
            queries.countSongsBySongCreator(userId)
        ]);
        const data = {
            name: 'profileSongs',
            visibleResults: addUrlPathsToResults(visibleResults, 'nArtist', 'nTitle'),
            currentPage: req.query.page,
            numOfPages: calculateNumOfPages(totalSongs),
            totalSongs
        };
        return res.send(data);
    },
    paginationArtists: async (req, res) => {
        const resultsToSkip = getResultsToSkip(req.query.page);
        const [results, totalArtists] = await Promise.all([
            queries.getArtists(resultsToSkip),
            queries.groupedArtistsCount()
        ]);
        const visibleResults = results.map(item => ({
            artist: item._id.name,
            nOfSongs: item.total,
            artistPath: utils.encodeChars(item._id.link)
        }));
        const data = {
            name: 'paginationArtists',
            visibleResults,
            currentPage: req.query.page,
            numOfPages: calculateNumOfPages(totalArtists),
            totalArtists
        };
        return res.send(data);
    },
    getAllResults: async (req, res) => {
        const allSongs = await queries.getAllSongs();
        const results = allSongs.map(song => ({
            ...song,
            nArtist: utils.encodeChars(song.nArtist),
            nTitle: utils.encodeChars(song.nTitle)
        }));
        return res.send(results);
    },
    paginationSongsByArtist: async (req, res) => {
        const resultsToSkip = getResultsToSkip(req.query.page);
        const { artist } = req.params;
        const [results, totalResults] = await Promise.all([
            queries.getSongsByArtist(artist, resultsToSkip),
            queries.countSongsByArtist(artist)
        ]);
        const visibleResults = results.map(item => ({
            artist: item._id.name,
            title: item._id.title,
            songPath: utils.encodeChars(item._id.songPath)
        }));
        const data = {
            name: 'paginationSongsByArtist',
            visibleResults,
            artistPath: utils.encodeChars(artist),
            currentPage: req.query.page,
            numOfPages: calculateNumOfPages(totalResults)
        };
        return res.send(data);
    },
    addSong: async (req, res) => {
        if (!req.user) {
            return res.send({
                redirectUrl: '',
                errorMsg: 'You gotta be logged if you wanna add songs.'
            });
        }
        const { artist, title, lyricsAndChords } = req.body;
        const newSong = {
            artist: utils.capitalizeName(artist),
            title,
            lyricsChords: lyricsAndChords,
            nArtist: normalizeString(artist),
            nTitle: normalizeString(title),
            songCreator: req.user._id.toString()
        };
        const titleRegex = createCaseInsensitiveRegex(title);
        const doesSongExist = await queries.getSongByArtistAndTitle(newSong.artist, titleRegex);
        if (doesSongExist) {
            return res.send({
                redirectUrl: '',
                errorMsg: "This song already exists in your song bank!"
            });
        }
        await queries.addSong(newSong);
        const redirectUrl = createSongUrl(newSong.nArtist, newSong.nTitle);
        return res.send({
            redirectUrl,
            errorMsg: ''
        });
    },
    editSong: async (req, res) => {
        const { artist, title, lyricsAndChords } = req.body;
        const { artist: paramArtist, title: paramTitle } = req.params;
        const newSong = {
            artist,
            title,
            lyricsChords: lyricsAndChords,
            nArtist: normalizeString(artist),
            nTitle: normalizeString(title)
        };
        const artistRegex = utils.createCaseInsensitiveRegex(paramArtist);
        const titleRegex = utils.createCaseInsensitiveRegex(paramTitle);
        await queries.editSong(artistRegex, titleRegex, newSong);
        return res.send({
            redirectUrl: createSongUrl(newSong.nArtist, newSong.nTitle),
            errorMsg: ""
        });
    },
    deleteSong: async (req, res) => {
        const { artist, title } = req.params;
        const artistRegex = utils.createCaseInsensitiveRegex(artist);
        const titleRegex = utils.createCaseInsensitiveRegex(title);
        await queries.deleteSong(artistRegex, titleRegex);
        return res.send({
            deletedMsg: "The song was deleted. Bye bye! :("
        });
    }
};

const addUrlPathsToResults = (results, artistField, titleField) => {
    return results.map(item => ({
        ...item,
        artistPath: utils.encodeChars(item[artistField]),
        songPath: utils.encodeChars(item[titleField])
    }));
};