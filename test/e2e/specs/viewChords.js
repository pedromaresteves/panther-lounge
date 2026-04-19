const Page = require("../pageobjects/page");

describe("View chords", () => {
    beforeEach(async () => {
        browser.deleteAllCookies();
    });

    it("Navigate through the app flow to view chords", async () => {
        const page = new Page();

        // 1. Navigate to homepage
        await page.open("");

        // 2. Click "Check out some chords!"
        const chordsLink = await $("a[href='/guitar-chords']");
        await chordsLink.waitForClickable({ timeout: 5000 });
        await chordsLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords"),
            { timeout: 10000 }
        );

        // 3. Click on "David Bowie"
        const artistLink = await $("*=David Bowie");
        await artistLink.waitForClickable({ timeout: 5000 });
        await artistLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords/"),
            { timeout: 10000 }
        );

        // 4. Click on "Space Oddity"
        const songLink = await $("*=Space Oddity");
        await songLink.waitForClickable({ timeout: 5000 });
        await songLink.click();
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes("/guitar-chords/"),
            { timeout: 10000 }
        );

        // 5. Assert chord page is visible
        await expect($("#editor")).toBeDisplayed();
    });
});