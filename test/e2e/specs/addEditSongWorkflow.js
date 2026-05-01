"use strict";

const assert = require('assert');
const { remote } = require('webdriverio');

describe('Add/Edit Song Workflow', () => {
    let browser;

    before(async () => {
        browser = await remote({
            capabilities: {
                browserName: 'chrome'
            }
        });
    });

    after(async () => {
        await browser.deleteSession();
    });

    it('should add a new song with chord syntax', async () => {
        await browser.url('http://localhost:3000/guitar-chords/add-song');

        // Fill in the form
        await browser.setValue('input[name="artist"]', 'Test Artist');
        await browser.setValue('input[name="title"]', 'Test Song');
        await browser.setValue('textarea[name="lyrics"]', '[Em]Test verse\n[Am]Test chorus');

        // Submit the form
        await browser.click('#submitButton');

        // Wait for redirect and verify URL
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/guitar-chords/test-artist/test-song');
        }, { timeout: 5000 });

        // Verify the content
        const lyricsContainer = await browser.$('#lyrics-container');
        const html = await lyricsContainer.getHTML(false);

        assert(html.includes('<span class="chord">Em</span>'));
        assert(html.includes('<span class="lyric">Test verse</span>'));
        assert(html.includes('<span class="chord">Am</span>'));
        assert(html.includes('<span class="lyric">Test chorus</span>'));
    });

    it('should edit an existing song', async () => {
        await browser.url('http://localhost:3000/guitar-chords/test-artist/test-song/edit');

        // Update the lyrics
        const lyricsField = await browser.$('textarea[name="lyrics"]');
        await lyricsField.clearValue();
        await lyricsField.setValue('[G]Updated verse\n[C]Updated chorus');

        // Submit the form
        await browser.click('#submitButton');

        // Wait for redirect and verify URL
        await browser.waitUntil(async () => {
            const url = await browser.getUrl();
            return url.includes('/guitar-chords/test-artist/test-song');
        }, { timeout: 5000 });

        // Verify the updated content
        const lyricsContainer = await browser.$('#lyrics-container');
        const html = await lyricsContainer.getHTML(false);

        assert(html.includes('<span class="chord">G</span>'));
        assert(html.includes('<span class="lyric">Updated verse</span>'));
        assert(html.includes('<span class="chord">C</span>'));
        assert(html.includes('<span class="lyric">Updated chorus</span>'));
    });

    it('should reject invalid chord syntax', async () => {
        await browser.url('http://localhost:3000/guitar-chords/add-song');

        // Fill in the form with invalid chord
        await browser.setValue('input[name="artist"]', 'Test Artist');
        await browser.setValue('input[name="title"]', 'Invalid Chord Test');
        await browser.setValue('textarea[name="lyrics"]', '[Hm]Invalid chord');

        // Submit the form
        await browser.click('#submitButton');

        // Verify error message
        const errorDiv = await browser.$('.alert-danger');
        const errorText = await errorDiv.getText();

        assert(errorText.includes('Invalid chord syntax'));
    });
});