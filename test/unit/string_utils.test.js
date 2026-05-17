"use strict";

const assert = require('assert');
const { normalizeForSearch } = require('../../database/utils/string_utils');

describe('string_utils', () => {
    describe('normalizeForSearch()', () => {
        it('should lowercase a string', () => {
            assert.strictEqual(normalizeForSearch('HELLO World'), 'helloworld');
        });

        it('should remove spaces', () => {
            assert.strictEqual(normalizeForSearch('hello world'), 'helloworld');
        });

        it('should remove non-alphanumeric characters', () => {
            assert.strictEqual(normalizeForSearch('hello-world!'), 'helloworld');
        });

        it('should handle multiple consecutive non-alphanumeric chars', () => {
            assert.strictEqual(normalizeForSearch('hello   world!!!'), 'helloworld');
        });

        it('should handle empty string', () => {
            assert.strictEqual(normalizeForSearch(''), '');
        });

        it('should strip diacritics', () => {
            assert.strictEqual(normalizeForSearch('café'), 'caf');
        });

        it('should handle numbers', () => {
            assert.strictEqual(normalizeForSearch('Song 123'), 'song123');
        });

        it('should handle mixed case and special chars', () => {
            assert.strictEqual(normalizeForSearch('The Beatles - Hey Jude!'), 'thebeatlesheyjude');
        });

        it('should handle underscores', () => {
            assert.strictEqual(normalizeForSearch('hello_world'), 'helloworld');
        });

        it('should handle dots', () => {
            assert.strictEqual(normalizeForSearch('Mr. Smith'), 'mrsmith');
        });
    });
});
