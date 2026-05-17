"use strict";

require('../helpers/setup');

const path = require('path');
const assert = require('assert');
const { mockModule, createMockReqRes } = require('../helpers/mockModule');

const mockQueries = {
  getSongsBySongCreator: async () => [
    {
      _id: '1',
      artist: 'Test Artist',
      title: 'Test Song',
      artistSearch: 'testartist',
      titleSearch: 'testsong',
      songCreator: 'user123'
    }
  ],
  countSongsBySongCreator: async () => 1,
  getArtists: async () => [
    { _id: { name: 'Artist A', link: 'artista' }, total: 5 }
  ],
  groupedArtistsCount: async () => 10,
  getAllSongs: async () => [{ artist: 'Test', title: 'Song 1' }],
  getSongsByArtist: async () => [
    {
      _id: {
        name: 'Test Artist',
        title: 'Test Song',
        songPath: 'testsong',
        artistSearch: 'testartist'
      }
    }
  ],
  countSongsByArtist: async () => 1,
  getSongByArtistAndTitle: async () => null,
  addSong: async () => ({ insertedId: 'abc123' }),
  editSong: async () => ({ modifiedCount: 1 }),
  deleteSong: async () => ({ deletedCount: 1 })
};

let apiController;
let restoreMock;

before(() => {
  // Clear cached apiController that may have been loaded by api_routes test
  delete require.cache[require.resolve('../../controllers/apiController')];

  restoreMock = mockModule(
    '../database/queries',
    path.resolve(__dirname, '../../controllers'),
    mockQueries
  );
  apiController = require('../../controllers/apiController');
});

after(() => {
  restoreMock();
  delete require.cache[require.resolve('../../controllers/apiController')];
});

describe('apiController', () => {
  describe('Pure helpers', () => {
    describe('normalizeString()', () => {
      it('should lowercase and strip diacritics', () => {
        assert.strictEqual(
          apiController.normalizeString('José González'),
          'jose gonzalez'
        );
      });
      it('should handle already normalized', () => {
        assert.strictEqual(apiController.normalizeString('Hello'), 'hello');
      });
      it('should handle empty string', () => {
        assert.strictEqual(apiController.normalizeString(''), '');
      });
      it('should handle mixed case', () => {
        assert.strictEqual(
          apiController.normalizeString('The Beatles'),
          'the beatles'
        );
      });
    });

    describe('getResultsToSkip()', () => {
      it('should return 0 for undefined page', () => {
        assert.strictEqual(apiController.getResultsToSkip(undefined), 0);
      });
      it('should return 0 for null page', () => {
        assert.strictEqual(apiController.getResultsToSkip(null), 0);
      });
      it('should return 0 for page 1', () => {
        assert.strictEqual(apiController.getResultsToSkip(1), 0);
      });
      it('should return 10 for page 2', () => {
        assert.strictEqual(apiController.getResultsToSkip(2), 10);
      });
      it('should return 20 for page 3', () => {
        assert.strictEqual(apiController.getResultsToSkip(3), 20);
      });
      it('should return 0 for page 0', () => {
        assert.strictEqual(apiController.getResultsToSkip(0), 0);
      });
    });

    describe('calculateNumOfPages()', () => {
      it('should return 0 for 0 results', () => {
        assert.strictEqual(apiController.calculateNumOfPages(0), 0);
      });
      it('should return 1 for 1 result', () => {
        assert.strictEqual(apiController.calculateNumOfPages(1), 1);
      });
      it('should return 1 for 10 results', () => {
        assert.strictEqual(apiController.calculateNumOfPages(10), 1);
      });
      it('should return 2 for 11 results', () => {
        assert.strictEqual(apiController.calculateNumOfPages(11), 2);
      });
      it('should return 3 for 21 results', () => {
        assert.strictEqual(apiController.calculateNumOfPages(21), 3);
      });
    });

    describe('createSongUrl()', () => {
      it('should create URL from artist and title', () => {
        const url = apiController.createSongUrl('beatles', 'heyjude');
        assert(url.startsWith('/guitar-chords/'));
        assert(url.includes('beatles'));
        assert(url.includes('heyjude'));
      });
      it('should encode special characters', () => {
        const url = apiController.createSongUrl('guns n roses', 'sweet child');
        assert(url.startsWith('/guitar-chords/'));
      });
    });

    describe('addUrlPathsToResults()', () => {
      it('should add artistPath and songPath to results', () => {
        const results = [
          { artistSearch: 'beatles', titleSearch: 'heyjude' }
        ];
        const output = apiController.addUrlPathsToResults(
          results,
          'artistSearch',
          'titleSearch'
        );
        assert(output[0].artistPath);
        assert(output[0].songPath);
      });
      it('should preserve existing fields', () => {
        const results = [
          { artistSearch: 'beatles', titleSearch: 'heyjude', extra: 'keep' }
        ];
        const output = apiController.addUrlPathsToResults(
          results,
          'artistSearch',
          'titleSearch'
        );
        assert.strictEqual(output[0].extra, 'keep');
      });
    });
  });

  describe('profileSongs()', () => {
    it('should return paginated songs for logged-in user', async () => {
      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        query: { page: '1' }
      });
      await apiController.profileSongs(req, res);
      assert(res._body);
      assert.strictEqual(res._body.name, 'profileSongs');
      assert(Array.isArray(res._body.visibleResults));
      assert.strictEqual(res._body.visibleResults.length, 1);
      assert('currentPage' in res._body);
      assert('numOfPages' in res._body);
      assert('totalSongs' in res._body);
    });

    it('should handle missing page query', async () => {
      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        query: {}
      });
      await apiController.profileSongs(req, res);
      assert(res._body);
      assert.strictEqual(res._body.currentPage, undefined);
    });
  });

  describe('paginationArtists()', () => {
    it('should return paginated artists', async () => {
      const { req, res } = createMockReqRes({ query: { page: '1' } });
      await apiController.paginationArtists(req, res);
      assert(res._body);
      assert.strictEqual(res._body.name, 'paginationArtists');
      assert(Array.isArray(res._body.visibleResults));
      assert.strictEqual(res._body.visibleResults.length, 1);
      assert('currentPage' in res._body);
      assert('numOfPages' in res._body);
      assert('totalArtists' in res._body);
    });
  });

  describe('getAllResults()', () => {
    it('should return all songs', async () => {
      const { req, res } = createMockReqRes();
      await apiController.getAllResults(req, res);
      assert(Array.isArray(res._body));
      assert.strictEqual(res._body.length, 1);
    });
  });

  describe('paginationSongsByArtist()', () => {
    it('should return paginated songs for artist', async () => {
      const { req, res } = createMockReqRes({
        params: { artist: 'testartist' },
        query: { page: '1' }
      });
      await apiController.paginationSongsByArtist(req, res);
      assert(res._body);
      assert.strictEqual(res._body.name, 'paginationSongsByArtist');
      assert(Array.isArray(res._body.visibleResults));
      assert.strictEqual(res._body.visibleResults.length, 1);
    });
  });

  describe('addSong()', () => {
    it('should reject when user is not logged in', async () => {
      const { req, res } = createMockReqRes({
        user: null,
        body: { artist: 'Test', title: 'Song', lyrics: '' }
      });
      await apiController.addSong(req, res);
      assert(res._body);
      assert(res._body.errorMsg);
      assert(res._body.errorMsg.includes('logged'));
    });

    it('should return error when song already exists', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => ({
        artist: 'Test',
        title: 'Existing'
      });

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        body: { artist: 'Test', title: 'Existing', lyrics: '' }
      });
      await apiController.addSong(req, res);
      assert(res._body.errorMsg);
      assert(res._body.errorMsg.includes('already exists'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should add song successfully when logged in and no duplicate', async () => {
      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        body: { artist: 'New Artist', title: 'New Song', lyrics: 'lyrics' }
      });
      await apiController.addSong(req, res);
      assert(res._body);
      assert.strictEqual(res._body.errorMsg, '');
      assert(res._body.redirectUrl);
    });

    it('should catch errors and return 500', async () => {
      const originalFn = mockQueries.addSong;
      mockQueries.addSong = async () => { throw new Error('DB error'); };

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        body: { artist: 'Test', title: 'Song', lyrics: '' }
      });
      await apiController.addSong(req, res);
      assert.strictEqual(res.statusCode, 500);
      assert(res._body.errorMsg);

      mockQueries.addSong = originalFn;
    });
  });

  describe('editSong()', () => {
    it('should return 404 when song not found', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => null;

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'nonexistent', title: 'nosong' },
        body: { artist: 'New', title: 'Song', lyrics: '' }
      });
      await apiController.editSong(req, res);
      assert.strictEqual(res.statusCode, 404);
      assert(res._body.errorMsg.includes('not found'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should return 403 when user is not authorized', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => ({
        artist: 'Test',
        title: 'Song',
        songCreator: 'otheruser'
      });

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'test', title: 'song' },
        body: { artist: 'New', title: 'Song', lyrics: '' }
      });
      await apiController.editSong(req, res);
      assert.strictEqual(res.statusCode, 403);
      assert(res._body.errorMsg.includes('not authorized'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should edit song successfully when authorized', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => ({
        artist: 'Test',
        title: 'Song',
        songCreator: 'user123'
      });

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'test', title: 'song' },
        body: { artist: 'Updated', title: 'Updated Song', lyrics: 'new lyrics' }
      });
      await apiController.editSong(req, res);
      assert(res._body);
      assert.strictEqual(res._body.errorMsg, '');
      assert(res._body.redirectUrl);

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should catch errors and return 500', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => {
        throw new Error('DB error');
      };

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'test', title: 'song' },
        body: { artist: 'Test', title: 'Song', lyrics: '' }
      });
      await apiController.editSong(req, res);
      assert.strictEqual(res.statusCode, 500);

      mockQueries.getSongByArtistAndTitle = originalFn;
    });
  });

  describe('deleteSong()', () => {
    it('should return 404 when song not found', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => null;

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'nonexistent', title: 'nosong' }
      });
      await apiController.deleteSong(req, res);
      assert.strictEqual(res.statusCode, 404);
      assert(res._body.errorMsg.includes('not found'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should return 403 when user is not authorized', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => ({
        artist: 'Test',
        title: 'Song',
        songCreator: 'otheruser'
      });

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'test', title: 'song' }
      });
      await apiController.deleteSong(req, res);
      assert.strictEqual(res.statusCode, 403);
      assert(res._body.errorMsg.includes('not authorized'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });

    it('should delete song successfully when authorized', async () => {
      const originalFn = mockQueries.getSongByArtistAndTitle;
      mockQueries.getSongByArtistAndTitle = async () => ({
        artist: 'Test',
        title: 'Song',
        songCreator: 'user123'
      });

      const { req, res } = createMockReqRes({
        user: { _id: { toString: () => 'user123' } },
        params: { artist: 'test', title: 'song' }
      });
      await apiController.deleteSong(req, res);
      assert(res._body);
      assert(res._body.deletedMsg);
      assert(res._body.deletedMsg.includes('deleted'));

      mockQueries.getSongByArtistAndTitle = originalFn;
    });
  });
});
