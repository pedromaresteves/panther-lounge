const connection = require("./mongodb_connection.js")

const getArtists = async (resultsToSkip) => {
    const db = await connection.run();
    const artists = await db.collection("songs").aggregate([
        { $group: { _id: { name: "$artist", link: "$nArtist" }, total: { $sum: 1 } } },
        { $sort: { '_id.link': 1 }, },
        { $skip: resultsToSkip },
        { $limit: 10 }
    ]).toArray();
    return artists;
};

const getSong = async (artist, title) => {
    const db = await connection.run();
    const song = await db.collection("songs").findOne({ nArtist: artist, nTitle: title });
    return song;
}

const getAllSongs = async () => {
    const db = await connection.run();
    let songs = await db.collection("songs").find({}).sort({ artist: 1 }).toArray();
    songs = songs.map(song => {
        return { ...song }
    })
    return songs;
};

const getSongsBySongCreator = async (songCreator, resultsToSkip = 0) => {
    const db = await connection.run();
    const pipeline = [
        { $match: { songCreator: songCreator } },
        { $sort: { artist: 1 } },
        { $skip: resultsToSkip },
        { $limit: 10 }
    ];
    const songs = await db.collection("songs").aggregate(pipeline).toArray();
    return songs;
};

const countSongsBySongCreator = async (songCreator) => {
    const db = await connection.run();
    const count = await db.collection("songs").countDocuments({ songCreator: songCreator });
    return count;
};

const groupedArtistsCount = async () => {
    const db = await connection.run();
    const pipeline = [
        {
            $group: {
                _id: "$artist",
                count: { $sum: 1 }
            }
        }
    ];
    const groupSongsByArtist = await db.collection("songs").aggregate(pipeline).toArray();
    return groupSongsByArtist.length;
};

const getSongsByArtist = async (artist, resultsToSkip = 0) => {
    const db = await connection.run();
    const pipeline = [
        { $match: { nArtist: artist } },
        { $group: { _id: { name: "$artist", title: "$title", songPath: "$nTitle" } } },
        { $sort: { '_id.link': 1 } },
        { $skip: resultsToSkip * 10 },
        { $limit: 10 }
    ];
    const songs = await db.collection("songs").aggregate(pipeline).toArray();
    return songs;
};

const countSongsByArtist = async (artist) => {
    const db = await connection.run();
    const count = await db.collection("songs").countDocuments({ nArtist: artist });
    return count;
};

const addSong = async (songData) => {
    const db = await connection.run();
    const result = await db.collection("songs").insertOne(songData);
    return result;
};

const editSong = async (artist, title, newSongData) => {
    const db = await connection.run();
    const result = await db.collection("songs").updateOne({ nArtist: artist, nTitle: title },
        { $set: { lyricsChords: newSongData.lyricsChords, title: newSongData.title, nTitle: newSongData.nTitle } });
    return result;
};

const deleteSong = async (artist, title) => {
    const db = await connection.run();
    const result = await db.collection("songs").deleteOne({ nArtist: artist, nTitle: title });
    return result;
}

const getSongByArtistAndTitle = async (artist, title) => {
    const db = await connection.run();
    const song = await db.collection("songs").findOne({ nArtist: artist, nTitle: title });
    return song;
}
module.exports = { getAllSongs, getArtists, getSongsBySongCreator, countSongsBySongCreator, groupedArtistsCount, getSongsByArtist, countSongsByArtist, addSong, getSongByArtistAndTitle, editSong, deleteSong, getSong };
