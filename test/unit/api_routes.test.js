"use strict";

require('../helpers/setup');

const assert = require('assert');
const apiRouter = require('../../routes/api');

describe('routes/api helpers', () => {
  describe('parseChordName()', () => {
    it('should parse a simple major chord', () => {
      const [root, suffix] = apiRouter.parseChordName('C');
      assert.strictEqual(root, 'C');
      assert.strictEqual(suffix, 'major');
    });

    it('should parse a minor chord', () => {
      const [root, suffix] = apiRouter.parseChordName('Am');
      assert.strictEqual(root, 'A');
      assert.strictEqual(suffix, 'minor');
    });

    it('should parse a seventh chord', () => {
      const [root, suffix] = apiRouter.parseChordName('G7');
      assert.strictEqual(root, 'G');
      assert.strictEqual(suffix, '7');
    });

    it('should parse a sus4 chord', () => {
      const [root, suffix] = apiRouter.parseChordName('Dsus4');
      assert.strictEqual(root, 'D');
      assert.strictEqual(suffix, 'sus4');
    });

    it('should parse a sharp root', () => {
      const [root, suffix] = apiRouter.parseChordName('C#m7');
      assert.strictEqual(root, 'C#');
      assert.strictEqual(suffix, 'm7');
    });

    it('should parse a flat root', () => {
      const [root, suffix] = apiRouter.parseChordName('Bbmaj7');
      assert.strictEqual(root, 'Bb');
      assert.strictEqual(suffix, 'maj7');
    });

    it('should convert maj suffix to major', () => {
      const [root, suffix] = apiRouter.parseChordName('Cmaj');
      assert.strictEqual(root, 'C');
      assert.strictEqual(suffix, 'major');
    });

    it('should convert min suffix to minor', () => {
      const [root, suffix] = apiRouter.parseChordName('Dmin');
      assert.strictEqual(root, 'D');
      assert.strictEqual(suffix, 'minor');
    });

    it('should convert m suffix to minor', () => {
      const [root, suffix] = apiRouter.parseChordName('Em');
      assert.strictEqual(root, 'E');
      assert.strictEqual(suffix, 'minor');
    });

    it('should handle slash chords', () => {
      const [root, suffix] = apiRouter.parseChordName('Am/G');
      assert.strictEqual(root, 'A');
      assert(suffix.includes('/G'));
    });

    it('should handle slash chords with complex main chord', () => {
      const [root, suffix] = apiRouter.parseChordName('C#m7/F#');
      assert.strictEqual(root, 'C#');
      assert(suffix.includes('/F#'));
    });
  });

  describe('findChordInDb()', () => {
    const mockDb = {
      chords: {
        C: [
          { suffix: 'major', positions: [{ frets: [0, 1, 0] }] },
          { suffix: '7', positions: [{ frets: [0, 1, 2] }] }
        ],
        Csharp: [
          { suffix: 'minor', positions: [{ frets: [1, 2, 1] }] }
        ],
        Bb: [
          { suffix: 'major', positions: [{ frets: [3, 3, 2] }] }
        ]
      }
    };

    it('should find a chord by root and suffix', () => {
      const chord = apiRouter.findChordInDb(mockDb, 'C', 'major');
      assert(chord);
      assert.strictEqual(chord.suffix, 'major');
    });

    it('should return null for non-existent root', () => {
      const chord = apiRouter.findChordInDb(mockDb, 'X', 'major');
      assert.strictEqual(chord, null);
    });

    it('should return null for non-existent suffix', () => {
      const chord = apiRouter.findChordInDb(mockDb, 'C', 'dim');
      assert.strictEqual(chord, null);
    });

    it('should normalize # to sharp', () => {
      const chord = apiRouter.findChordInDb(mockDb, 'C#', 'minor');
      assert(chord);
      assert.strictEqual(chord.suffix, 'minor');
    });

    it('should normalize b', () => {
      const chord = apiRouter.findChordInDb(mockDb, 'Bb', 'major');
      assert(chord);
      assert.strictEqual(chord.suffix, 'major');
    });

    it('should return null for empty db chords', () => {
      const chord = apiRouter.findChordInDb({ chords: {} }, 'C', 'major');
      assert.strictEqual(chord, null);
    });
  });
});
