const LocalLogin = require("../pageobjects/localLogin.page");
const LoginPage = require("../pageobjects/login.page");
const ProfilePage = require("../pageobjects/profile.page");

describe("Cover local login", () => {
    beforeEach(async () => {
        browser.deleteAllCookies()
        await LoginPage.open();
        await LoginPage.localLoginBtn.click();
    });

    it("Missing credentials error if email input is empty", async () => {
        await LocalLogin.login("", "cage");
        await expect(LocalLogin.errorMsg).toHaveTextContaining("Missing credentials");
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Missing credentials error if password input is empty", async () => {
        await LocalLogin.login("cage@mail.com", "");
        await expect(LocalLogin.errorMsg).toHaveTextContaining("Missing credentials");
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("User not found error if email is not registered", async () => {
        await LocalLogin.login("usernotregistered@mail.com", "1234");
        await expect(LocalLogin.errorMsg).toHaveTextContaining("User not found.");
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Wrong credentials error if the password doesn't match", async () => {
        await LocalLogin.login("cage@mail.com", "1234");
        await expect(LocalLogin.errorMsg).toHaveTextContaining("Incorrect username or password.");
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Login with valid credentials", async () => {
        await LocalLogin.login("cage@mail.com", "cage");
        await expect(ProfilePage.profileStats).toBeDisplayed();
        await expect(ProfilePage.addSongBtn).toBeDisplayed();
    });

    // it("If I'm logged in I am redirected when I go to auth/login", async () => {
    //     await LoginPage.open(); //MUST IMPLEMENT FEATURE FIRST
    // });
});


