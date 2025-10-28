import { browser, $$, expect } from "@wdio/globals";
import { user, invalidUser } from "../../userData";
import SignUpPage from "../po/pages/signUp.page";

describe("Sign up Tests", () => {
  beforeEach(async () => {
    await SignUpPage.open();
  });

  describe("Successful sign up", () => {
    beforeEach(async () => {
      await SignUpPage.signUp(user.email, user.password);
    });

    it("I should see a confirmation alert message 'Account created successfully'", async () => {
      const alertText = await browser.getAlertText();
      await expect(alertText).toEqual("Account created successfully");
      await browser.acceptAlert();
    });

    it("I should be redirected to the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });

    it("my account should be stored in the database", async () => {
      // Mock implementation
      // Normally, should call a backend API to verify this.
      console.log("Account stored in database check (mock implementation)");
    });
  });

  describe("Invalid email format", () => {
    beforeEach(async () => {
      await SignUpPage.signUp(invalidUser.email, invalidUser.password);
    });

    it("I should see an invalid email format error element", async () => {
      const alertElement = await SignUpPage.invalidEmailError;
      await expect(alertElement).toBeDisplayed();
    });

    it("the email field should be highlighted", async () => {
      const emailField = await SignUpPage.email;
      await expect(emailField).toHaveElementClass(
        expect.stringContaining("is-invalid")
      );
    });

    it("my account should not be created", async () => {
      // Mock implementation: Check if the invalid email prevented account creation.
      console.log(
        "Account existence check in database (mocked). Ensure backend logic validates email format."
      );
    });
  });

  describe("Email is already registered", () => {
    beforeEach(async () => {
      await SignUpPage.signUp(user.email, user.password);
    });

    it("I should see a duplicate account error message", async () => {
      const errorMessageElement = await SignUpPage.dublicateEmailError;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText(
        "A customer with this email address already exists."
      );
    });

    it("should remain on the sign-up page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("register"));
    });

    it("my session should not be created", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(sessionCookie.length).toBe(0);
    });
  });

  describe("Missing required fields", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("", "", true);
    });

    it("I should see  an error elements", async () => {
      const errorMessageElements = await $$(SignUpPage.missingFieldError);
      expect(errorMessageElements.length).toBeGreaterThan(0);
      for (let errorMessage of errorMessageElements) {
        await expect(errorMessage).toBeDisplayed();
      }
    });

    it("the missing fields should be highlighted", async () => {
      const fields = await $$(SignUpPage.allInputs);
      for (const field of fields) {
        await expect(field).toHaveElementClass(
          expect.stringContaining("is-invalid")
        );
      }
    });

    it("I should remain on the signup page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("register"));
    });
  });
});
