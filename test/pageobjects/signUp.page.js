import { $, browser } from "@wdio/globals";

export class SignUpPage {
  get firstname() {
    return $("#first_name");
  }
  get lastname() {
    return $("#last_name");
  }
  get dob() {
    return $("#dob");
  }
  get street() {
    return $("#street");
  }
  get postalcode() {
    return $("#postal_code");
  }
  get city() {
    return $("#city");
  }
  get state() {
    return $("#state");
  }
  get country() {
    return $("#country");
  }
  get phone() {
    return $("#phone");
  }

  get email() {
    return $("#email");
  }
  get password() {
    return $("#password");
  }

  get btnSubmit() {
    return $("//form//button[@type='submit']");
  }

  get missingFieldError() {
    return ("//div[@data-test]");
  }
  get invalidEmailError() {
    return $("//div[@data-test='email-error']");
  }
  get dublicateEmailError() {
    return $("//div[@data-test='register-error']//div[@class='help-block']");
  }
  get allInputs() {
    return ("//input");
  }

  async signUp(email, password, isEmptyFields = false) {
  await this.firstname.setValue(isEmptyFields ? "" : "Adam");
  await this.lastname.setValue(isEmptyFields ? "" : "Doe");
  await this.dob.setValue(isEmptyFields ? "" : "1998-01-01");
  await this.street.setValue(isEmptyFields ? "" : "Kiev St.");
  await this.postalcode.setValue(isEmptyFields ? "" : "12345");
  await this.city.setValue(isEmptyFields ? "" : "Bishkek");
  await this.state.setValue(isEmptyFields ? "" : "Kyrgyzstan");

  if (!isEmptyFields) {
    await this.country.selectByVisibleText("Kyrgyzstan");
  }

  await this.phone.setValue(isEmptyFields ? "" : "0707707708");
  await this.email.setValue(isEmptyFields ? "" : email);
  await this.password.setValue(isEmptyFields ? "" : password);
  await this.btnSubmit.click();
}
  async open() {
    await browser.url("/auth/register");
  }
}

export default new SignUpPage();
