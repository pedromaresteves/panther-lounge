describe("View chords", () => {
    beforeEach(async () => {
        await browser.deleteAllCookies();
    });

    it("should navigate through the app flow to view chords", async () => {
        await browser.url("http://127.0.0.1:5000/");

        const chordsLink = await $("a[href='/guitar-chords']");
        await chordsLink.waitForClickable({ timeout: 5000 });
        await chordsLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords"),
            { timeout: 10000 }
        );

        const artistLink = await $("*=David Bowie");
        await artistLink.waitForClickable({ timeout: 5000 });
        await artistLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords/"),
            { timeout: 10000 }
        );

        const songLink = await $("*=Space Oddity");
        await songLink.waitForClickable({ timeout: 5000 });
        await songLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords/"),
            { timeout: 10000 }
        );

        await expect($("#lyrics-container")).toBeDisplayed();
    });
});