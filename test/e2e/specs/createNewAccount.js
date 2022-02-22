const CreateNewAccountPage = require("../pageobjects/createAccount.page");
const ProfilePage = require("../pageobjects/profile.page");
const UserModel = require("../../../models/user");
const mongoose = require("mongoose");
const userToBeCreated = {
    userName: "temp",
    userEmail: "tempuser@mail.com",
    userPass: "temp"
}
const {PORT, DBCONNECTION, sessionCookieKey} = process.env;



describe("Cover Create New Account", () => {
    beforeEach(async () => {
        await CreateNewAccountPage.open();
    });

    after(async ()=>{
        mongoose.connect(DBCONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", function () {
        console.log("DB Connection Started");
        });
        const dick = await UserModel.findOneAndDelete({email: userToBeCreated.userEmail});
        db.close()
    });

    it("If an registered email is introduced, warn user", async () => {
        await CreateNewAccountPage.createAccount("cage", "cage@mail.com", "cage");
        await expect(CreateNewAccountPage.errorMsg).toHaveTextContaining("Email aldready registered.");
        await expect(ProfilePage.profileStats).not.toBeDisplayed();
    });

    it("Register user", async () => {
        await CreateNewAccountPage.createAccount(userToBeCreated.userName, userToBeCreated.userEmail, userToBeCreated.userPass);
        await expect(ProfilePage.profileStats).toBeDisplayed();
        await expect(ProfilePage.addSongBtn).toBeDisplayed();
    });
});


