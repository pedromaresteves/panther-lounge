const LoginPage = require('../pageobjects/login.page.boiler');
const SecurePage = require('../pageobjects/secure.page.boiler');

describe('My Login application', () => {
    
    it('should login with valid credentials', async () => {
        await LoginPage.open();

        await LoginPage.login('tomsmith', 'SuperSecretPassword!');
        await expect(SecurePage.flashAlert).toBeExisting();
        await expect(SecurePage.flashAlert).toHaveTextContaining(
            'You logged into a secure area!');
    });
});


