"use strict";

const assert = require('assert');
const utils = require('../../utils/utils');
const { convertDeltaToPlainText } = require('../../database/migrations/003_convert_quill_to_plaintext');

describe('Chord Utilities', () => {
    describe('parseChords()', () => {
        it('should parse simple chord syntax', () => {
            const result = utils.parseChords('[Em]Verse 1');
            assert.deepStrictEqual(result, [
                { type: 'chord', content: 'Em' },
                { type: 'lyric', content: 'Verse 1' }
            ]);
        });
        
        it('should parse multiple chords', () => {
            const result = utils.parseChords('[Em]Verse [Am]Lyric');
            assert.deepStrictEqual(result, [
                { type: 'chord', content: 'Em' },
                { type: 'lyric', content: 'Verse ' },
                { type: 'chord', content: 'Am' },
                { type: 'lyric', content: 'Lyric' }
            ]);
        });
        
        it('should handle newlines', () => {
            const result = utils.parseChords('[Em]Verse\n[Am]Lyric');
            assert.deepStrictEqual(result, [
                { type: 'chord', content: 'Em' },
                { type: 'lyric', content: 'Verse\n' },
                { type: 'chord', content: 'Am' },
                { type: 'lyric', content: 'Lyric' }
            ]);
        });
        
        it('should handle empty input', () => {
            const result = utils.parseChords('');
            assert.deepStrictEqual(result, []);
        });
        
        it('should handle input without chords', () => {
            const result = utils.parseChords('Verse 1');
            assert.deepStrictEqual(result, [
                { type: 'lyric', content: 'Verse 1' }
            ]);
        });
    });
    
    describe('renderChordsHTML()', () => {
        it('should render segments to HTML', () => {
            const segments = [
                { type: 'chord', content: 'Em' },
                { type: 'lyric', content: 'Verse 1' }
            ];
            const result = utils.renderChordsHTML(segments);
            assert.strictEqual(result, '<span class="chord">Em</span><span class="lyric">Verse 1</span>');
        });
        
        it('should escape HTML special characters', () => {
            const segments = [
                { type: 'chord', content: 'Em' },
                { type: 'lyric', content: '<script>alert("xss")</script>' }
            ];
            const result = utils.renderChordsHTML(segments);
            assert.strictEqual(
                result,
                '<span class="chord">Em</span><span class="lyric">&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</span>'
            );
        });
        
        it('should handle empty segments', () => {
            const result = utils.renderChordsHTML([]);
            assert.strictEqual(result, '');
        });
    });
    
    describe('validateChordSyntax()', () => {
        it('should validate correct chord syntax', () => {
            const result = utils.validateChordSyntax('[Em]Verse [Am7]Lyric');
            assert.deepStrictEqual(result, { valid: true, error: null });
        });
        
        it('should reject invalid chord syntax', () => {
            const result = utils.validateChordSyntax('[Hm]Invalid chord');
            assert.deepStrictEqual(result, {
                valid: false,
                error: 'Invalid chord syntax: "Hm". Use format like [Em], [Dsus4], [C#m7]'
            });
        });
        
        it('should handle empty input', () => {
            const result = utils.validateChordSyntax('');
            assert.deepStrictEqual(result, { valid: true, error: null });
        });
    });
    
    describe('convertDeltaToPlainText()', () => {
        it('should convert Quill Delta to plain text with chord syntax', () => {
            const deltaOps = [
                { insert: "Em", attributes: { bold: true } },
                { insert: "\nVerse 1\n" },
                { insert: "Am", attributes: { bold: true } },
                { insert: "\nLyric line\n" }
            ];
            const result = convertDeltaToPlainText(deltaOps);
            assert.strictEqual(result, "[Em]\nVerse 1\n[Am]\nLyric line");
        });
        
        it('should handle mixed chords and lyrics on same line', () => {
            const deltaOps = [
                { insert: "Em", attributes: { bold: true } },
                { insert: " Verse 1\n" }
            ];
            const result = convertDeltaToPlainText(deltaOps);
            assert.strictEqual(result, "[Em] Verse 1");
        });
        
        it('should handle empty delta', () => {
            const result = convertDeltaToPlainText([]);
            assert.strictEqual(result, "");
        });
    });
});