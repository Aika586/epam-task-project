import { browser, expect } from "@wdio/globals";
import { user, invalidUser } from "../../data/userData";
import SignUpPage from "../../pageObjects/pages/signUp.page";

describe("Sign up Tests", () => {
  
  describe("Successful sign up", () => {

    before(async () => {
      await SignUpPage.open();
    });
    
    it("Happy sign up", async () => {
      await SignUpPage.signUp(user.email, user.password);
      const alertText = await browser.getAlertText();
      await expect(alertText).toEqual("Account created successfully");
      await browser.acceptAlert();
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });

  });

  describe("Invalid email format", () => {

    before(async () => {
      await SignUpPage.open();
    });
    
    it("sign up with invalid email format", async () => {
      await SignUpPage.signUp(invalidUser.email, invalidUser.password);
      const alertElement = await SignUpPage.invalidEmailError;
      const emailField = await SignUpPage.email;
      await expect(alertElement).toBeDisplayed();
      await expect(emailField).toHaveElementClass(expect.stringContaining("is-invalid"));
    });

  });

  describe("Email already registered", () => {

    before(async () => {
      await SignUpPage.open();
    });
    
    it("sign up with email already exists", async () => {
      await SignUpPage.signUp(user.email, user.password);
      const sessionCookie = await browser.getCookies(["session_id"]);
      const errorMessageElement = await SignUpPage.dublicateEmailError;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText(
        "A customer with this email address already exists."
      );
      await expect(sessionCookie.length).toBe(0);
    });

  });

  describe("Missing required fields", () => {

    before(async () => {
      await SignUpPage.open();
    });
    
    it("sign up with missing fields", async () => {
      await SignUpPage.signUp("", "", true);
      const errorMessageElements = await SignUpPage.missingFieldError;
      const fields = await SignUpPage.allInputs;
      for (const el of errorMessageElements) {
        await expect(el).toBeDisplayed();
      }
      for (const field of fields) {
        await expect(field).toHaveElementClass(expect.stringContaining("is-invalid"));
      }
    });

  });

});
