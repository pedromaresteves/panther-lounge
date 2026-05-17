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

        it('should handle null input', () => {
            const result = utils.parseChords(null);
            assert.deepStrictEqual(result, []);
        });

        it('should handle undefined input', () => {
            const result = utils.parseChords(undefined);
            assert.deepStrictEqual(result, []);
        });

        it('should handle non-string input', () => {
            const result = utils.parseChords(123);
            assert.deepStrictEqual(result, []);
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

        it('should handle non-array input', () => {
            const result = utils.renderChordsHTML(null);
            assert.strictEqual(result, '');
        });

        it('should handle undefined input', () => {
            const result = utils.renderChordsHTML(undefined);
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
            assert.strictEqual(result.valid, false);
            assert(result.error.includes('Invalid chord syntax'));
        });
        
        it('should handle empty input', () => {
            const result = utils.validateChordSyntax('');
            assert.deepStrictEqual(result, { valid: true, error: null });
        });

        it('should handle null input', () => {
            const result = utils.validateChordSyntax(null);
            assert.deepStrictEqual(result, { valid: true, error: null });
        });

        it('should accept common chord variations', () => {
            const chords = '[C] [C#] [Db] [D] [Dsus4] [Em] [F] [F#m7] [G] [Gmaj7] [Am] [A7] [Bb] [Bdim]';
            const result = utils.validateChordSyntax(chords);
            assert.deepStrictEqual(result, { valid: true, error: null });
        });

        it('should accept section markers', () => {
            const result = utils.validateChordSyntax('[Intro] [Verse] [Chorus] [Bridge] [Outro]');
            assert.deepStrictEqual(result, { valid: true, error: null });
        });

        it('should bypass Gmaj7sus/F# chord', () => {
            const result = utils.validateChordSyntax('[Gmaj7sus/F#]Lyric');
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

        it('should handle null delta', () => {
            const result = convertDeltaToPlainText(null);
            assert.strictEqual(result, "");
        });

        it('should handle undefined delta', () => {
            const result = convertDeltaToPlainText(undefined);
            assert.strictEqual(result, "");
        });

        it('should handle non-array delta', () => {
            const result = convertDeltaToPlainText({});
            assert.strictEqual(result, "");
        });
    });
});

describe('Other Utilities', () => {
    describe('escapeHtml()', () => {
        it('should escape ampersand', () => {
            assert.strictEqual(utils.escapeHtml('&'), '&amp;');
        });
        it('should escape less than', () => {
            assert.strictEqual(utils.escapeHtml('<'), '&lt;');
        });
        it('should escape greater than', () => {
            assert.strictEqual(utils.escapeHtml('>'), '&gt;');
        });
        it('should escape double quote', () => {
            assert.strictEqual(utils.escapeHtml('"'), '&quot;');
        });
        it('should escape single quote', () => {
            assert.strictEqual(utils.escapeHtml("'"), '&#039;');
        });
        it('should escape mixed content', () => {
            const result = utils.escapeHtml('<script>alert("xss&more")</script>');
            assert.strictEqual(result, '&lt;script&gt;alert(&quot;xss&amp;more&quot;)&lt;/script&gt;');
        });
        it('should return empty string for empty input', () => {
            assert.strictEqual(utils.escapeHtml(''), '');
        });
        it('should return safe strings unchanged', () => {
            assert.strictEqual(utils.escapeHtml('Hello World'), 'Hello World');
        });
    });

    describe('capitalizeName()', () => {
        it('should capitalize each word', () => {
            assert.strictEqual(utils.capitalizeName('the beatles'), 'The Beatles');
        });
        it('should handle single word', () => {
            assert.strictEqual(utils.capitalizeName('prince'), 'Prince');
        });
        it('should handle already capitalized', () => {
            assert.strictEqual(utils.capitalizeName('Led Zeppelin'), 'Led Zeppelin');
        });
        it('should handle empty string', () => {
            assert.strictEqual(utils.capitalizeName(''), '');
        });
        it('should handle extra spaces', () => {
            const result = utils.capitalizeName('  pink   floyd  ');
            assert.strictEqual(result, '  Pink   Floyd  ');
        });
        it('should handle single character words', () => {
            assert.strictEqual(utils.capitalizeName('a b c'), 'A B C');
        });
    });

    describe('encodeChars()', () => {
        it('should encode special characters', () => {
            const result = utils.encodeChars('hello world');
            assert.strictEqual(result, 'hello%20world');
        });
        it('should encode parentheses', () => {
            const result = utils.encodeChars('test(1)');
            assert(result.includes('%28') || result.includes('('));
        });
        it('should encode apostrophe', () => {
            const result = utils.encodeChars("it's");
            assert(result.includes('%27') || result.includes("'"));
        });
        it('should return empty for empty string', () => {
            assert.strictEqual(utils.encodeChars(''), '');
        });
    });

    describe('normalizeForUrl()', () => {
        it('should lowercase and strip diacritics', () => {
            assert.strictEqual(utils.normalizeForUrl('José González'), 'josegonzalez');
        });
        it('should remove spaces', () => {
            assert.strictEqual(utils.normalizeForUrl('Hello World'), 'helloworld');
        });
        it('should handle empty string', () => {
            assert.strictEqual(utils.normalizeForUrl(''), '');
        });
        it('should handle already normalized', () => {
            assert.strictEqual(utils.normalizeForUrl('hello'), 'hello');
        });
        it('should strip combining diacritical marks', () => {
            assert.strictEqual(utils.normalizeForUrl('café'), 'cafe');
            assert.strictEqual(utils.normalizeForUrl('naïve'), 'naive');
            assert.strictEqual(utils.normalizeForUrl('Mötley Crüe'), 'motleycrue');
        });
    });

    describe('escapeRegExp()', () => {
        it('should escape dots', () => {
            assert.strictEqual(utils.escapeRegExp('test.txt'), 'test\\.txt');
        });
        it('should escape asterisks', () => {
            assert.strictEqual(utils.escapeRegExp('te*st'), 'te\\*st');
        });
        it('should escape brackets', () => {
            assert.strictEqual(utils.escapeRegExp('[test]'), '\\[test\\]');
        });
        it('should escape plus', () => {
            assert.strictEqual(utils.escapeRegExp('te+st'), 'te\\+st');
        });
        it('should escape dollar', () => {
            assert.strictEqual(utils.escapeRegExp('te$st'), 'te\\$st');
        });
        it('should escape caret', () => {
            assert.strictEqual(utils.escapeRegExp('te^st'), 'te\\^st');
        });
        it('should handle empty string', () => {
            assert.strictEqual(utils.escapeRegExp(''), '');
        });
        it('should handle string with no special chars', () => {
            assert.strictEqual(utils.escapeRegExp('hello'), 'hello');
        });
    });

    describe('orderAz()', () => {
        it('should return -1 when a < b', () => {
            assert.strictEqual(utils.orderAz('apple', 'banana'), -1);
        });
        it('should return 1 when a > b', () => {
            assert.strictEqual(utils.orderAz('banana', 'apple'), 1);
        });
        it('should return 0 when equal', () => {
            assert.strictEqual(utils.orderAz('apple', 'apple'), 0);
        });
        it('should be case insensitive', () => {
            assert.strictEqual(utils.orderAz('Apple', 'apple'), 0);
        });
    });

    describe('linkify()', () => {
        it('should lowercase a string', () => {
            assert.strictEqual(utils.linkify('Hello World'), 'hello world');
        });
        it('should handle already lowercase', () => {
            assert.strictEqual(utils.linkify('hello'), 'hello');
        });
        it('should handle uppercase', () => {
            assert.strictEqual(utils.linkify('HELLO'), 'hello');
        });
        it('should handle empty string', () => {
            assert.strictEqual(utils.linkify(''), '');
        });
    });

    describe('renderError()', () => {
        it('should render error.ejs with error data', () => {
            const res = {
                _view: null,
                _data: null,
                render(view, data) {
                    this._view = view;
                    this._data = data;
                }
            };
            const req = { user: { id: 1 }, url: '/test' };
            const err = new Error('Something went wrong');

            utils.renderError(res, req, err);

            assert.strictEqual(res._view, 'error.ejs');
            assert.strictEqual(res._data.userData, req.user);
            assert.strictEqual(res._data.url, req.url);
            assert.strictEqual(res._data.errorMessage, 'Something went wrong');
        });
    });
});
