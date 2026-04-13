const connection = require("./mongodb_connection.js")
const { normalizeForSearch } = require("./utils/string_utils")
const ObjectId = require('mongodb').ObjectId;

const getArtists = async (resultsToSkip) => {
    if (resultsToSkip < 0) throw new Error('resultsToSkip must be non-negative');
    const db = await connection.run();
    try {
        const artists = await db.collection("songs").aggregate([
            { $group: { _id: { name: "$artist", link: "$artistSearch" }, total: { $sum: 1 } } },
            { $sort: { '_id.name': 1 } },
            { $skip: resultsToSkip },
            { $limit: 10 }
        ]).toArray();
        return artists;
    } catch (error) {
        console.error('Error fetching artists:', error);
        throw error;
    }
};

const getSong = async (artist, title) => {
    if (typeof artist !== 'string' || typeof title !== 'string') {
        throw new Error('Artist and title must be strings');
    }
    if (!artist || !title) throw new Error('Artist and title are required');
    const db = await connection.run();
    try {
        return await db.collection("songs").findOne({
            artistSearch: normalizeForSearch(artist),
            titleSearch: normalizeForSearch(title)
        });
    } catch (error) {
        console.error('Error fetching song:', error);
        throw error;
    }
};

const getAllSongs = async () => {
    const db = await connection.run();
    try {
        return await db.collection("songs").find({}).sort({ artist: 1 }).toArray();
    } catch (error) {
        console.error('Error fetching all songs:', error);
        throw error;
    }
};

const getSongsBySongCreator = async (songCreator, resultsToSkip = 0) => {
    if (!songCreator) throw new Error('songCreator is required');
    if (resultsToSkip < 0) throw new Error('resultsToSkip must be non-negative');
    const db = await connection.run();
    const pipeline = [
        { $match: { songCreator: songCreator } },
        { $sort: { artist: 1 } },
        { $skip: resultsToSkip },
        { $limit: 10 }
    ];
    try {
        const songs = await db.collection("songs").aggregate(pipeline).toArray();
        return songs;
    } catch (error) {
        console.error('Error fetching songs by song creator:', error);
        throw error;
    }
};

const countSongsBySongCreator = async (songCreator) => {
    if (!songCreator) throw new Error('songCreator is required');
    const db = await connection.run();
    try {
        const count = await db.collection("songs").countDocuments({ songCreator: songCreator });
        return count;
    } catch (error) {
        console.error('Error counting songs by song creator:', error);
        throw error;
    }
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
    try {
        const groupSongsByArtist = await db.collection("songs").aggregate(pipeline).toArray();
        return groupSongsByArtist.length;
    } catch (error) {
        console.error('Error counting grouped artists:', error);
        throw error;
    }
};

const getSongsByArtist = async (artist, resultsToSkip = 0) => {
    if (!artist) throw new Error('artist is required');
    if (resultsToSkip < 0) throw new Error('resultsToSkip must be non-negative');
    const db = await connection.run();
    const normalizedArtist = normalizeForSearch(artist);
    const pipeline = [
        { $match: { artistSearch: normalizedArtist } },
        { $group: { _id: { name: "$artist", title: "$title", songPath: "$titleSearch" } } },
        { $sort: { '_id.name': 1 } },
        { $skip: resultsToSkip },
        { $limit: 10 }
    ];
    try {
        const songs = await db.collection("songs").aggregate(pipeline).toArray();
        return songs;
    } catch (error) {
        console.error('Error fetching songs by artist:', error);
        throw error;
    }
};

const countSongsByArtist = async (artist) => {
    if (!artist) throw new Error('artist is required');
    const db = await connection.run();
    const normalizedArtist = normalizeForSearch(artist);
    try {
        const count = await db.collection("songs").countDocuments({ artistSearch: normalizedArtist });
        return count;
    } catch (error) {
        console.error('Error counting songs by artist:', error);
        throw error;
    }
};

const addSong = async (songData) => {
    if (!songData || !songData.artist || !songData.title) {
        throw new Error('Song data must include artist and title');
    }
    const db = await connection.run();
    try {
        const result = await db.collection("songs").insertOne({
            ...songData,
            artistSearch: normalizeForSearch(songData.artist),
            titleSearch: normalizeForSearch(songData.title)
        });
        return result;
    } catch (error) {
        console.error('Error adding song:', error);
        throw error;
    }
};

const editSong = async (artist, title, newSongData) => {
    if (!artist || !title) throw new Error('Artist and title are required');
    const db = await connection.run();
    const normalizedArtist = normalizeForSearch(artist);
    const normalizedTitle = normalizeForSearch(title);
    try {
        const result = await db.collection("songs").updateOne(
            { artistSearch: normalizedArtist, titleSearch: normalizedTitle },
            { $set: { 
                lyricsChords: newSongData.lyricsChords, 
                title: newSongData.title, 
                titleSearch: normalizeForSearch(newSongData.title) 
            }}
        );
        return result;
    } catch (error) {
        console.error('Error editing song:', error);
        throw error;
    }
};

const deleteSong = async (artist, title) => {
    if (!artist || !title) throw new Error('Artist and title are required');
    const db = await connection.run();
    const normalizedArtist = normalizeForSearch(artist);
    const normalizedTitle = normalizeForSearch(title);
    try {
        const result = await db.collection("songs").deleteOne({
            artistSearch: normalizedArtist,
            titleSearch: normalizedTitle
        });
        return result;
    } catch (error) {
        console.error('Error deleting song:', error);
        throw error;
    }
};

const getSongByArtistAndTitle = async (artist, title) => {
    if (!artist || !title) throw new Error('Artist and title are required');
    const db = await connection.run();
    try {
        return await db.collection("songs").findOne({
            artistSearch: normalizeForSearch(artist),
            titleSearch: normalizeForSearch(title)
        });
    } catch (error) {
        console.error('Error fetching song by artist and title:', error);
        throw error;
    }
};

const deleteSongsBatch = async (songIds) => {
    if (!songIds || !Array.isArray(songIds) || songIds.length === 0) throw new Error('songIds array is required');
    const db = await connection.run();
    try {
        const objectIds = songIds.map(id => {
            try { return new ObjectId(id); }
            catch { return null; }
        }).filter(id => id !== null);
        
        if (objectIds.length === 0) throw new Error('No valid song IDs provided');
        
        const result = await db.collection("songs").deleteMany({ _id: { $in: objectIds } });
        return result;
    } catch (error) {
        console.error('Error batch deleting songs:', error);
        throw error;
    }
};
module.exports = { getAllSongs, getArtists, getSongsBySongCreator, countSongsBySongCreator, groupedArtistsCount, getSongsByArtist, countSongsByArtist, addSong, getSongByArtistAndTitle, editSong, deleteSong, getSong, deleteSongsBatch };
