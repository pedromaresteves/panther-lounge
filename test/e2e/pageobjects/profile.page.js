const Page = require("./page.js");

class LoginPage extends Page {
    get profileStats(){
        return $("#profile-stats")
    }

    get addSongBtn(){
        return $("#make-song")
    }

    open() {
        return super.open("profile");
    }
}

module.exports = new LoginPage();
