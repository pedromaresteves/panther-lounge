const assert = require("assert");
const LocalLogin = require("../pageobjects/localLogin.page");
const LoginPage = require("../pageobjects/login.page");
const ProfilePage = require("../pageobjects/profile.page");
const connection = require("../../../database/mongodb_connection.js");
const queries = require("../../../database/queries.js");

// Timestamped so parallel workers never collide on a fixed email.
const googleOnlyEmail = `googleonly.${Date.now()}@mail.com`;

describe("Refuse local login for Google-only accounts (no takeover)", () => {
    before(async () => {
        await connection.run();
        await queries.createNewUser({
            username: "googleonly",
            email: googleOnlyEmail,
            googleId: "G-E2E-ONLY"
        });
    });

    after(async () => {
        await queries.deleteUser(googleOnlyEmail);
    });

    beforeEach(async () => {
        browser.deleteAllCookies();
        await LoginPage.open();
        await LoginPage.localLoginBtn.click();
    });

    it("Rejects password login on a Google-only account", async () => {
        await LocalLogin.login(googleOnlyEmail, "attacker-chosen-1");
        await expect(LocalLogin.errorMsg).toHaveText(expect.stringContaining("Google login"));
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Leaves the Google account without a password", async () => {
        const user = await queries.findUserByEmail(googleOnlyEmail);
        assert.strictEqual(user.salt, undefined);
        assert.strictEqual(user.hashedPassword, undefined);
    });
});
