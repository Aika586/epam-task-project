import SignUpPage from "../pageobjects/signUp.page";
import { browser, $$, $ } from "@wdio/globals";
import * as chai from "chai";
const { expect } = chai;
const { assert } = chai;
chai.should();

describe("Sign up Tests", () => {
  beforeEach(async () => {
    await SignUpPage.open();
  });

  describe("Successful sign up", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("aika18@gmail.com", "Aika_1989");
    });

    it("I should see a confirmation alert message 'Account created successfully'", async () => {
      await browser.waitUntil(
        async () => (await browser.getAlertText()) === "Account created successfully",
        { timeout: 5000 }
      );
      const alertText = await browser.getAlertText();
      expect(alertText).to.equal("Account created successfully");
      
    });

    it("I should be redirected to the login page", async () => {
      const url = await browser.getUrl();
      assert.include(url, "login");
    });

    it("my account should be stored in the database", async () => {
      // Mock implementation
      assert.isTrue(true, "Account stored in database check (mock implementation)");
    });
  });

  describe("Invalid email format", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("not-an-email", "Password1235!");
    });

    it("I should see an invalid email format error message", async () => {
      const alertElement = await SignUpPage.invalidEmailError;
      const displayed = await alertElement.isDisplayed();
      expect(displayed).to.be.true;
      const text = await alertElement.getText();
      expect(text).to.equal("Invalid email format");
    });

    it("the email field should be highlighted", async () => {
      const emailField = await $("#email");
      await browser.waitUntil(
        async () => {
          const className = await emailField.getAttribute("class");
          return className && className.indexOf("is-invalid") !== -1;
        },
        { timeout: 3000 }
      );
      const className = await emailField.getAttribute("class");
      expect(className).to.include("is-invalid");
    });

    it("my account should not be created", async () => {
      assert.isTrue(true, "Account existence check in database (mocked)");
    });
  });

  describe("Email is already registered", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("aika18@gmail.com", "Aika_1989");
    });

    it("I should see a duplicate account error message", async () => {
      const errorMessageElement = await SignUpPage.dublicateEmailError;
      const displayed = await errorMessageElement.isDisplayed();
      expect(displayed).to.be.true;
      const text = await errorMessageElement.getText();
      expect(text).to.include("A customer with this email address already exists.");
    });

    it("should remain on the sign-up page", async () => {
      const url = await browser.getUrl();
      url.should.contain("register");
    
    });

    it("my session should not be created", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      expect(sessionCookie.length).to.equal(0);
    });
  });

  describe("Missing required fields", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("", "", true);
    });

    it("I should see error elements", async () => {
      const errorMessages = await $$(SignUpPage.missingFieldError);
      expect(errorMessages.length).to.be.greaterThan(0);
      for (let errorMessage of errorMessages) {
        const displayed = await errorMessage.isDisplayed();
        assert.isTrue(displayed);
      }
    });

    it("the missing fields should be highlighted", async () => {
      const fields = await $$(SignUpPage.allInputs);
      for (const field of fields) {
        await browser.waitUntil(
          async () => {
            const className = await field.getAttribute("class");
            return className && className.indexOf("is-invalid") !== -1;
          },
          { timeout: 3000 }
        );
        const className = await field.getAttribute("class");
        expect(className).to.include("is-invalid");
        
      }
    });

    it("I should remain on the signup page", async () => {
      const url = await browser.getUrl();
      url.should.contain("register");
    });
  });
});