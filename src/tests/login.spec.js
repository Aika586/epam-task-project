import LoginPage from "../po/pages/login.page";
import { user,invalidFormat,invalidUser } from "../../userData";
import { browser } from "@wdio/globals";
import * as chai from "chai";
const { expect } = chai;
const { assert } = chai;
chai.should();
describe("Login Tests", () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  describe("successfully login", () => {
    beforeEach(async () => {
      await LoginPage.login(user.email,user.password);
    });

    it("should be redirected to my account page", async () => {
      const url = await browser.getUrl();
      url.should.contain("account");
    });

    it("my session should be active for future requests", async () => {
      const cookies = await browser.getCookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      expect(sessionCookie).to.not.be.undefined;
    });
  });

  describe("Missing email and password", () => {
    beforeEach(async () => {
      await LoginPage.login("", "");
    });

    it("should show error element when fields are missing", async () => {
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        const displayed = await el.isDisplayed();
        assert.isTrue(displayed);
      }
    });

    it("should be highlighted when fields are missing", async () => {
      const usernameInvalid = await LoginPage.inputUsername.getAttribute(
        "aria-invalid"
      );
      const passwordInvalid = await LoginPage.inputPassword.getAttribute(
        "aria-invalid"
      );
      expect(usernameInvalid).to.equal("true");
      expect(passwordInvalid).to.equal("true");
    });
  });

  describe("Invalid credentials", () => {
    beforeEach(async () => {
      await LoginPage.login(invalidUser.email, invalidUser.password);
    });

    it("should see an invalid login error message", async () => {
      await (await LoginPage.loginErrorMessage).waitForExist({ timeout: 5000 });
      const refreshedErrorElement = await LoginPage.loginErrorMessage;
      const displayed = await refreshedErrorElement.isDisplayed();
      expect(displayed).to.be.true;
    });

    it("should remain on the login page", async () => {
      const url = await browser.getUrl();
      assert.include(url, "login");
    });

    it("my session should not be created", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      sessionCookie.length.should.equal(0);
    });
  });

  describe("Invalid email format during login", () => {
    beforeEach(async () => {
      await LoginPage.login(invalidFormat.email, invalidFormat.password);
    });

    it("I should see an invalid email format error message", async () => {
      const invalidEmail = await LoginPage.invalidEmailError;
      const displayed = await invalidEmail.isDisplayed();
      expect(displayed).to.be.true;
      const text = await invalidEmail.getText();
      text.should.contain("Email format is invalid");
    });

    it("I should remain on the login page", async () => {
      const url = await browser.getUrl();
      url.should.contain("login");
    });
  });
});
