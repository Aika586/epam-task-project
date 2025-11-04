import { browser, expect } from "@wdio/globals";
import { user, invalidUser } from "../data/userData";
import SignUpPage from "../pageObjects/pages/signUp.page";

describe("Sign up Tests", () => {
  
  describe("Successful sign up", () => {

    before(async () => {
       await SignUpPage.open();
      await SignUpPage.signUp(user.email, user.password);
    });

    it("should display a confirmation alert message", async () => {
      const alertText = await browser.getAlertText();
      await expect(alertText).toEqual("Account created successfully");
      await browser.acceptAlert();
    });

    it("should redirect to the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });

  });

  describe("Invalid email format", () => {

    before(async () => {
       await SignUpPage.open();
      await SignUpPage.signUp(invalidUser.email, invalidUser.password);
    });

    it("should display invalid email format error", async () => {
      const alertElement = await SignUpPage.invalidEmailError;
      await expect(alertElement).toBeDisplayed();
    });

    it("should highlight the email field", async () => {
      const emailField = await SignUpPage.email;
      await expect(emailField).toHaveElementClass(expect.stringContaining("is-invalid"));
    });

  });

  describe("Email already registered", () => {

    before(async () => {
       await SignUpPage.open();
      await SignUpPage.signUp(user.email, user.password);
    });

    it("should display duplicate account error message", async () => {
      const errorMessageElement = await SignUpPage.dublicateEmailError;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText(
        "A customer with this email address already exists."
      );
    });

    it("should not create a session", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(sessionCookie.length).toBe(0);
    });

  });

  describe("Missing required fields", () => {

    before(async () => {
       await SignUpPage.open();
      await SignUpPage.signUp("", "", true);
    });

    it("should display error elements for missing fields", async () => {
      const errorMessageElements = await SignUpPage.missingFieldError;
      for (const el of errorMessageElements) {
        await expect(el).toBeDisplayed();
      }
    });

    it("should highlight all missing input fields", async () => {
      const fields = await SignUpPage.allInputs;
      for (const field of fields) {
        await expect(field).toHaveElementClass(expect.stringContaining("is-invalid"));
      }
    });

  });

});
