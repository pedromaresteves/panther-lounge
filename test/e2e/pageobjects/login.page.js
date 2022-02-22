const Page = require("./page.js");

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get googleLoginBtn(){
        return $(".btn-google")
    }

    get localLoginBtn(){
        return $(".btn-info")
    }

    get createAccountBtn(){
        return $(".btn-secondary")
    }

    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using username and password
     */

    /**
     * overwrite specific options to adapt it to page object
     */
    open() {
        return super.open("auth/login");
    }
}

module.exports = new LoginPage();
