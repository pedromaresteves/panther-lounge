const CreateNewAccountPage = require("../pageobjects/createAccount.page");
const ProfilePage = require("../pageobjects/profile.page");
const connection = require("../../../database/mongodb_connection.js");
const queries = require("../../../database/queries.js");
const userToBeCreated = {
    userName: "temp",
    userEmail: "tempuser@mail.com",
    userPass: "temp"
}


describe("Cover Create New Account", () => {
    beforeEach(async () => {
        await connection.run();
        await CreateNewAccountPage.open();
    });

    after(async () => {
        return await queries.deleteUser(userToBeCreated.userEmail);
    });

    it("If an registered email is introduced, warn user", async () => {
        await CreateNewAccountPage.createAccount("cage", "cage@mail.com", "cage");
        await expect(CreateNewAccountPage.errorMsg).toHaveText(expect.stringContaining("Email aldready registered."));
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Register user", async () => {
        await CreateNewAccountPage.createAccount(userToBeCreated.userName, userToBeCreated.userEmail, userToBeCreated.userPass);
        await expect(ProfilePage.profileStats).toBeDisplayed();
        await expect(ProfilePage.addSongBtn).toBeDisplayed();
    });
});


