import { $} from "@wdio/globals";
import { user } from "../../../userData";
import Page from "./page";

export class SignUpPage extends Page {
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
  await this.firstname.setValue(isEmptyFields ? "" : user.firstName);
  await this.lastname.setValue(isEmptyFields ? "" : user.lastName);
  await this.dob.setValue(isEmptyFields ? "" :user.dob );
  await this.street.setValue(isEmptyFields ? "" : user.street);
  await this.postalcode.setValue(isEmptyFields ? "" : user.postalCode);
  await this.city.setValue(isEmptyFields ? "" : user.city);
  await this.state.setValue(isEmptyFields ? "" : user.state);

  if (!isEmptyFields) {
    await this.country.selectByVisibleText(user.country);
  }

  await this.phone.setValue(isEmptyFields ? "" : user.phone);
  await this.email.setValue(isEmptyFields ? "" : email);
  await this.password.setValue(isEmptyFields ? "" : password);
  await this.btnSubmit.click();
}

  async open() {
    await super.open("/auth/register");
  }
}

export default new SignUpPage();
