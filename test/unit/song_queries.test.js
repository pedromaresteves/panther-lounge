"use strict";

require('../helpers/setup');

const assert = require('assert');
const queries = require('../../database/song_queries');

describe('song_queries', () => {
    describe('getSong()', () => {
        it('should reject when artist is not a string', async () => {
            await assert.rejects(
                () => queries.getSong(123, 'title'),
                /Artist and title must be strings/
            );
        });

        it('should reject when title is not a string', async () => {
            await assert.rejects(
                () => queries.getSong('artist', 456),
                /Artist and title must be strings/
            );
        });

        it('should reject when both are not strings', async () => {
            await assert.rejects(
                () => queries.getSong(null, undefined),
                /Artist and title must be strings/
            );
        });

        it('should reject when artist is empty', async () => {
            await assert.rejects(
                () => queries.getSong('', 'title'),
                /Artist and title are required/
            );
        });

        it('should reject when title is empty', async () => {
            await assert.rejects(
                () => queries.getSong('artist', ''),
                /Artist and title are required/
            );
        });
    });

    describe('getSongsBySongCreator()', () => {
        it('should reject when songCreator is missing', async () => {
            await assert.rejects(
                () => queries.getSongsBySongCreator(),
                /songCreator is required/
            );
        });

        it('should reject when songCreator is null', async () => {
            await assert.rejects(
                () => queries.getSongsBySongCreator(null),
                /songCreator is required/
            );
        });

        it('should reject when resultsToSkip is negative', async () => {
            await assert.rejects(
                () => queries.getSongsBySongCreator('user123', -1),
                /resultsToSkip must be non-negative/
            );
        });
    });

    describe('countSongsBySongCreator()', () => {
        it('should reject when songCreator is missing', async () => {
            await assert.rejects(
                () => queries.countSongsBySongCreator(),
                /songCreator is required/
            );
        });

        it('should reject when songCreator is null', async () => {
            await assert.rejects(
                () => queries.countSongsBySongCreator(null),
                /songCreator is required/
            );
        });
    });

    describe('getArtists()', () => {
        it('should reject when resultsToSkip is negative', async () => {
            await assert.rejects(
                () => queries.getArtists(-1),
                /resultsToSkip must be non-negative/
            );
        });
    });

    describe('getSongsByArtist()', () => {
        it('should reject when artist is missing', async () => {
            await assert.rejects(
                () => queries.getSongsByArtist(),
                /artist is required/
            );
        });

        it('should reject when artist is null', async () => {
            await assert.rejects(
                () => queries.getSongsByArtist(null),
                /artist is required/
            );
        });

        it('should reject when resultsToSkip is negative', async () => {
            await assert.rejects(
                () => queries.getSongsByArtist('artist', -1),
                /resultsToSkip must be non-negative/
            );
        });
    });

    describe('countSongsByArtist()', () => {
        it('should reject when artist is missing', async () => {
            await assert.rejects(
                () => queries.countSongsByArtist(),
                /artist is required/
            );
        });

        it('should reject when artist is null', async () => {
            await assert.rejects(
                () => queries.countSongsByArtist(null),
                /artist is required/
            );
        });
    });

    describe('addSong()', () => {
        it('should reject when songData is missing', async () => {
            await assert.rejects(
                () => queries.addSong(),
                /Song data must include artist and title/
            );
        });

        it('should reject when songData is null', async () => {
            await assert.rejects(
                () => queries.addSong(null),
                /Song data must include artist and title/
            );
        });

        it('should reject when artist is missing from songData', async () => {
            await assert.rejects(
                () => queries.addSong({ title: 'Test' }),
                /Song data must include artist and title/
            );
        });

        it('should reject when title is missing from songData', async () => {
            await assert.rejects(
                () => queries.addSong({ artist: 'Test' }),
                /Song data must include artist and title/
            );
        });
    });

    describe('editSong()', () => {
        it('should reject when artist is missing', async () => {
            await assert.rejects(
                () => queries.editSong(),
                /Artist and title are required/
            );
        });

        it('should reject when title is missing', async () => {
            await assert.rejects(
                () => queries.editSong('artist'),
                /Artist and title are required/
            );
        });

        it('should reject when artist is empty', async () => {
            await assert.rejects(
                () => queries.editSong('', 'title'),
                /Artist and title are required/
            );
        });

        it('should reject when title is empty', async () => {
            await assert.rejects(
                () => queries.editSong('artist', ''),
                /Artist and title are required/
            );
        });
    });

    describe('deleteSong()', () => {
        it('should reject when artist is missing', async () => {
            await assert.rejects(
                () => queries.deleteSong(),
                /Artist and title are required/
            );
        });

        it('should reject when title is missing', async () => {
            await assert.rejects(
                () => queries.deleteSong('artist'),
                /Artist and title are required/
            );
        });

        it('should reject when artist is empty', async () => {
            await assert.rejects(
                () => queries.deleteSong('', 'title'),
                /Artist and title are required/
            );
        });

        it('should reject when title is empty', async () => {
            await assert.rejects(
                () => queries.deleteSong('artist', ''),
                /Artist and title are required/
            );
        });
    });

    describe('getSongByArtistAndTitle()', () => {
        it('should reject when artist is missing', async () => {
            await assert.rejects(
                () => queries.getSongByArtistAndTitle(),
                /Artist and title are required/
            );
        });

        it('should reject when artist is empty', async () => {
            await assert.rejects(
                () => queries.getSongByArtistAndTitle('', 'title'),
                /Artist and title are required/
            );
        });

        it('should reject when title is empty', async () => {
            await assert.rejects(
                () => queries.getSongByArtistAndTitle('artist', ''),
                /Artist and title are required/
            );
        });
    });

    describe('deleteSongsBatch()', () => {
        it('should reject when songIds is missing', async () => {
            await assert.rejects(
                () => queries.deleteSongsBatch(),
                /songIds array is required/
            );
        });

        it('should reject when songIds is null', async () => {
            await assert.rejects(
                () => queries.deleteSongsBatch(null),
                /songIds array is required/
            );
        });

        it('should reject when songIds is not an array', async () => {
            await assert.rejects(
                () => queries.deleteSongsBatch('not-array'),
                /songIds array is required/
            );
        });

        it('should reject when songIds is empty', async () => {
            await assert.rejects(
                () => queries.deleteSongsBatch([]),
                /songIds array is required/
            );
        });
    });
});
