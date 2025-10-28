import LoginPage from "../po/pages/login.page";
import { user, invalidFormat, invalidUser } from "../../userData";
import { browser, expect } from "@wdio/globals";
describe("Login Tests", () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  describe("successfully login", () => {
    beforeEach(async () => {
      await LoginPage.login(user.email, user.password);
    });

    it("should be redirected to my account page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("account"));
    });

    it("my session should be active for future requests", async () => {
      const cookies = await browser.getCookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      await expect(sessionCookie).not.toBeUndefined();
    });
  });

  describe("Missing email and password", () => {
    beforeEach(async () => {
      await LoginPage.login("", "");
    });

    it("should show error element when fields are missing", async () => {
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        await expect(el).toBeDisplayed();
      }
    });

    it("should be highlighted when fields are missing", async () => {
      await expect(LoginPage.inputUsername).toHaveAttribute(
        "aria-invalid",
        "true"
      );
      await expect(LoginPage.inputPassword).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });
  });

  describe("Invalid credentials", () => {
    beforeEach(async () => {
      await LoginPage.login(invalidUser.email, invalidUser.password);
    });

    it("should see an invalid login error message", async () => {
      const errorMessageElement = await LoginPage.loginErrorMessage;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText("Invalid email or password");
    });

    it("should remain on the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });

    it("my session should not be created", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(sessionCookie.length).toBe(0);
    });
  });

  describe("Invalid email format during login", () => {
    beforeEach(async () => {
      await LoginPage.login(invalidFormat.email, invalidFormat.password);
    });

    it("I should see an invalid email format error message", async () => {
      const invalidEmail = await LoginPage.invalidEmailError;
      await expect(invalidEmail).toBeDisplayed();
      await expect(invalidEmail).toHaveText("Email format is invalid");
    });

    it("I should remain on the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });
  });
});
