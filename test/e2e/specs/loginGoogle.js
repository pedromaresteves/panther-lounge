const LocalLogin = require("../pageobjects/localLogin.page");
const LoginPage = require("../pageobjects/login.page");
const ProfilePage = require("../pageobjects/profile.page");

describe("Cover Google Oauth login", () => {
    it("Go to Google Oauth Login and check URL", async () => {
        await LoginPage.open();
        await LoginPage.googleLoginBtn.click();
        await expect(browser).toHaveUrlContaining('google')
    });
});


