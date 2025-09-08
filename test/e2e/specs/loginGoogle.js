const LoginPage = require("../pageobjects/login.page");

describe("Cover Google Oauth login", () => {
    it("Go to Google Oauth Login and check URL", async () => {
        await LoginPage.open();
        await LoginPage.googleLoginBtn.click();
        await expect(browser).toHaveUrl(expect.stringContaining('google'))
    });
});


