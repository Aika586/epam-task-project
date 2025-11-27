import { $, $$ } from "@wdio/globals";
import BasePage from "./basePage";

export class LoginPage extends BasePage {
   constructor() {
    super("/auth/login");
  }
  
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
    return $("//div[@data-test='login-error']");
  }

  get missingFieldError() {
    return $$("//div[@data-test]");
  }

  get invalidEmailError() {
    return $("//div[@data-test='email-error']//div");
  }

  async login(email, password) {
    await this.inputUsername.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }
}

export default new LoginPage();
