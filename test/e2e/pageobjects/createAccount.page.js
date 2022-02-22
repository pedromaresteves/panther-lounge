const Page = require("./page.js");

class CreateAccountPage extends Page {
    get userNameInput(){
        return $("#username")
    }

    get userEmailInput(){
        return $("#email")
    }

    get userPassInput(){
        return $("#password")
    }

    get submitBtn(){
        return $("form button")
    }

    get errorMsg(){
        return $("h1~span"); 
    }

    async createAccount(userName, userEmail, userPass){
        await this.userNameInput.setValue(userName);
        await this.userEmailInput.setValue(userEmail)
        await this.userPassInput.setValue(userPass);
        await this.submitBtn.click();
    }

    open() {
        return super.open("auth/create-account");
    }

}

module.exports = new CreateAccountPage();
