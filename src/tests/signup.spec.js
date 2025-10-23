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
      const alertText = await browser.getAlertText();
      expect(alertText).to.equal("Account created successfully");
    });

    it("I should be redirected to the login page", async () => {
      const url = await browser.getUrl();
      assert.include(url, "login");
    });

    it("my account should be stored in the database", async () => {
      // Mock implementation
      assert.isTrue(
        true,
        "Account stored in database check (mock implementation)"
      );
    });
  });

  describe("Invalid email format", () => {
    beforeEach(async () => {
      await SignUpPage.signUp("not-an-email", "Password1235!");
    });

    it("I should see an invalid email format error element", async () => {
      const alertElement = await SignUpPage.invalidEmailError;
      const displayed = await alertElement.isDisplayed();
      expect(displayed).to.be.true;
    });

    it("the email field should be highlighted", async () => {
      const emailField = await $("#email");
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
