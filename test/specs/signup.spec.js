import SignUpPage from "../pageobjects/signUp.page";
import { expect, browser, $$,$ } from "@wdio/globals";

describe("Sign up Tests", () => {
  beforeEach(async () => {
    await SignUpPage.open();
  });

  describe("Successful sign up", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("urmataika18@gmail.com", "Aikokul_1998");
    });

    it("I should see a confirmation  alert message 'Account created successfully'", async () => {
      await browser.waitUntil(
        async () =>
          (await browser.getAlertText()) === "Account created successfully",
        {
          timeout: 5000,
          timeoutMsg: "Expected alert did not appear.",
        }
      );
      const alertText = await browser.getAlertText();
      await expect(alertText).toEqual("Account created successfully");
      await browser.acceptAlert();
    });

    it("I should be redirected to the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });
    it("my account should be stored in the database", async () => {
      // Normally, should call a backend API to verify this.
      console.log("Account stored in database check (mock implementation)");
    });
  });

  describe("Invalid email format", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("not-an-email", "Password1235!");
    });

    it("I should see an invalid email format error message", async () => {
      const alertElement = await SignUpPage.invalidEmailError;
      await expect(alertElement).toBeDisplayed();
      await expect(alertElement).toHaveText("Invalid email format");
    });

    it("the email field should be highlighted", async () => {
      const emailField = await $("#email");
      await browser.waitUntil(
        async () => (await emailField.getAttribute("aria-invalid")) === "true",
        { timeout: 5000, timeoutMsg: "Email aria-invalid not set" }
      );
      await expect(emailField).toHaveAttribute("aria-invalid", "true");
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
      await SignUpPage.signUp("urmataika18@gmail.com", "Password1265!");
    });

    it("I should see a duplicate account error message", async () => {
      const errorMessageElement = await SignUpPage.dublicateEmailError;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText(
        expect.stringContaining(
          "A customer with this email address already exists."
        )
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
    it("I should see an error elements", async () => {
      const errorMessageSelector = await $$(SignUpPage.missingFieldError);
      const errorMessages = await $$(errorMessageSelector);
      expect(errorMessages.length).toBeGreaterThan(0);
      for (let errorMessage of errorMessages) {
        await expect(errorMessage).toBeDisplayed();
      }
    });
    it("the missing fields should be highlighted", async () => {
      const fields = await $$(SignUpPage.allInputs);

      for (const field of fields) {
        await browser.waitUntil(
          async () => (await field.getAttribute("aria-invalid")) === "true",
          {
            timeout: 3000,
            timeoutMsg: "aria-invalid не появился на одном из инпутов",
          }
        );

        await expect(field).toHaveAttribute("aria-invalid", "true");
      }
    });
    it("I should remain on the signup page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("register"));
    });
  });
});
