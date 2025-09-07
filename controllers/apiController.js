const utils = require("../utils/utils");
const queries = require("../database/queries");
const resultsPerPage = 10;

module.exports = {
    profileSongs: async function (req, res) {
        const data = {
            name: 'profileSongs',
            visibleResults: [],
            currentPage: req.query.page,
            numOfPages: 1,
            totalSongs: 0
        };
        const resultsToSkip = calculateResultsToSkip(req.query.page);
        data.visibleResults = await queries.getSongsBySongCreator(req.user._id.toString(), resultsToSkip);
        data.visibleResults = updateVisibleResultsWithUrlPaths(data.visibleResults)
        data.totalSongs = await queries.countSongsBySongCreator(req.user._id.toString());
        data.numOfPages = calculateHowManySongPagesUserHas(data.totalSongs);
        return res.send(data);
    },
    paginationArtists: async function (req, res) {
        let data = {
            name: 'paginationArtists',
            visibleResults: [],
            currentPage: req.query.page,
            numOfPages: 1,
            totalArtists: 0
        };
        const resultsToSkip = calculateResultsToSkip(req.query.page);
        const results = await queries.getArtists(resultsToSkip);
        results.forEach(function (item) {
            data.visibleResults.push({ artist: item._id.name, nOfSongs: item.total, artistPath: utils.encodeChars(item._id.link) });
        });
        data.totalSongs = await queries.groupedArtistsCount();
        data.numOfPages = Math.ceil(data.totalSongs / resultsPerPage);
        return res.send(data);
    },
    getAllResults: async (req, res) => {
        const allSongs = await queries.getAllSongs();
        await allSongs.forEach(function (song) {
            console.log(song.nArtist, "FUUUUCK");
            song.nArtist = utils.encodeChars(song.nArtist)
            song.nTitle = utils.encodeChars(song.nTitle)
        });
        return res.send(allSongs);
    },
    paginationSongsByArtist: async function (req, res) {
        let data = {
            name: 'paginationSongsByArtist',
            visibleResults: [],
            artistPath: utils.encodeChars(req.params.artist),
            currentPage: req.query.page,
            numOfPages: 1
        };
        const resultsToSkip = calculateResultsToSkip(req.query.page);
        const results = await queries.getSongsByArtist(req.params.artist, resultsToSkip);
        results.forEach(function (item) {
            data.visibleResults.push({ artist: item._id.name, title: item._id.title, songPath: utils.encodeChars(item._id.songPath) })
        });
        const totalResults = await queries.countSongsByArtist(req.params.artist);
        data.numOfPages = Math.ceil(totalResults / resultsPerPage);
        return res.send(data);
    },
    addSong: async function (req, res) {
        const data = {
            redirectUrl: '',
            errorMsg: ''
        };
        if (!req.user) {
            data.errorMsg = 'You gotta be logged if you wanna add songs.'
            return res.send(data);
        }
        const newSong = {
            artist: utils.capitalizeName(req.body.artist),
            title: req.body.title,
            lyricsChords: req.body.lyricsAndChords,
            nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            songCreator: req.user._id.toString()
        };
        let newSongTitleRegex = new RegExp("^" + newSong.title + "$", "gi");
        const doesSongExist = await queries.getSongByArtistAndTitle(newSong.artist, newSongTitleRegex);
        if (!doesSongExist) {
            await queries.addSong(newSong);
            data.redirectUrl = `/guitar-chords/${utils.encodeChars(newSong.nArtist)}/${utils.encodeChars(newSong.nTitle)}`;
            return res.send(data);
        }
        data.errorMsg = "This song already exists in your song bank!";
        return res.send(data);
    },
    editSong: async function (req, res) {
        const newSong = {
            artist: req.body.artist,
            title: req.body.title,
            lyricsChords: req.body.lyricsAndChords,
            nArtist: req.body.artist.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""),
            nTitle: req.body.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        };
        const data = {
            redirectUrl: `/guitar-chords/${utils.encodeChars(newSong.nArtist)}/${utils.encodeChars(newSong.nTitle)}`,
            errorMsg: ""
        };
        const artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        const titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        await queries.editSong(artistRegex, titleRegex, newSong);
        return res.send(data);
    },
    deleteSong: async function (req, res) {
        const artistRegex = new RegExp("^" + utils.escapeRegExp(req.params.artist) + "$", "gi");
        const titleRegex = new RegExp("^" + utils.escapeRegExp(req.params.title) + "$", "gi");
        const data = {
            deletedMsg: "The song was deleted. Bye bye! :("
        };
        await queries.deleteSong(artistRegex, titleRegex);
        return res.send(data);
    },
};

const calculateResultsToSkip = (pageNumber) => {
    const resultsToSkip = !pageNumber ? 0 : (pageNumber - 1) * resultsPerPage;
    return resultsToSkip;
};

const calculateHowManySongPagesUserHas = (totalSongs) => {
    const numOfPages = Math.ceil(totalSongs / resultsPerPage);
    return numOfPages;
};

const updateVisibleResultsWithUrlPaths = (results) => {
    const updatedResults = results.map(item => {
        return {
            ...item,
            artistPath: utils.encodeChars(item.nArtist),
            songPath: utils.encodeChars(item.nTitle)
        };
    });
    return updatedResults;
}