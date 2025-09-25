import { $,$$,browser } from "@wdio/globals"

export class LoginPage {

  get inputUsername() {
    return $("#email");
  }

  get inputPassword() {
    return $("#password");
  }

  get btnSubmit() {
    return $("//form//input[@type='submit']");
  }

   get loginErrorMessage() {
    return $("//div[@data-test='login-error']//div");
  }
  get missingFieldError() {
    return  $$("//div[@data-test]");
  }
   get invalidEmailError() {
    return $("//div[@data-test='email-error']//div");
  }

  async login(email, password) {
    await this.inputUsername.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  
  async open() {
    await browser.url("/auth/login");
  }
}

export default new LoginPage();
