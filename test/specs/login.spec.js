
import LoginPage from "../pageobjects/login.page";

import { expect, browser } from "@wdio/globals";

describe("Login Tests", () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  describe("successfully login", () => {
    beforeEach(async () => {
      await LoginPage.login("baatirbekovna.6@mail.ru", "Baatirbekovna_1989");
    });

    it("should be redirected to my account page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("account"));
    });

    it("my session should be active for future requests", async () => {
      const cookies = await browser.getCookies();
      console.log("Cookies: ", cookies);
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      console.log("Session Cookie: ", sessionCookie);
      await expect(sessionCookie).not.toBeUndefined();
    });
  });

  describe("Missing email and password", () => {
    beforeEach(async () => {
      await LoginPage.login("", "");
    });

    it("should show error element  when fields is missing", async () => {
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        await expect(el).toBeDisplayed();
      }
    });

    it("should be highlighted when fields is missing", async () => {
      await browser.waitUntil(
        async () =>
          (await LoginPage.inputUsername.getAttribute("aria-invalid")) ===
          "true",
        { timeout: 3000, timeoutMsg: "Email aria-invalid not set" }
      );
      await browser.waitUntil(
        async () =>
          (await LoginPage.inputPassword.getAttribute("aria-invalid")) ===
          "true",
        { timeout: 3000, timeoutMsg: "Password aria-invalid not set" }
      );
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
      await LoginPage.login("invaliduser@gmail.com", "WrongPassword!");
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
      await LoginPage.login("invaliduser", "WrongPassword!");
    });
    it("I should see an invalid email format error message", async () => {
      const invalidEmail = await LoginPage.invalidEmailError;
      await expect(invalidEmail).toBeDisplayed();
      await expect(invalidEmail).toHaveText(
        expect.stringContaining("Email format is invalid")
      );
    });
    it("I should remain on the login page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("login"));
    });
  });
});
