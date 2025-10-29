import LoginPage from "../pageObjects/pages/login.page";
import { user, invalidFormat, invalidUser } from "../data/userData";
import { browser, expect } from "@wdio/globals";

describe("Login Tests", () => {

  beforeEach(async () => {
    await LoginPage.open();
  });

  describe("successfully login", () => {

    it("should be redirected to my account page", async () => {
      
      await LoginPage.login(user.email, user.password);
      await expect(browser).toHaveUrl(expect.stringContaining("account"));
    });

    it("my session should be active for future requests", async () => {

      await LoginPage.login(user.email, user.password);
      const cookies = await browser.getCookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      await expect(sessionCookie).not.toBeUndefined();

    });

  });

  describe("Missing email and password", () => {

    it("should show error element when fields are missing", async () => {

      await LoginPage.login("", "");
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        await expect(el).toBeDisplayed();
      }
    });

    it("should be highlighted when fields are missing", async () => {
      await LoginPage.login("", "");

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

    it("should see an invalid login error message", async () => {

      await LoginPage.login(invalidUser.email, invalidUser.password);
      const errorMessageElement = await LoginPage.loginErrorMessage;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText("Invalid email or password");

    });

    it("should remain on the login page", async () => {

      await LoginPage.login(invalidUser.email, invalidUser.password);
      await expect(browser).toHaveUrl(expect.stringContaining("login"));

    });

    it("my session should not be created", async () => {

      await LoginPage.login(invalidUser.email, invalidUser.password);
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(sessionCookie.length).toBe(0);

    });

  });

  describe("Invalid email format during login", () => {

    it("I should see an invalid email format error message", async () => {

      await LoginPage.login(invalidFormat.email, invalidFormat.password);
      const invalidEmail = await LoginPage.invalidEmailError;
      await expect(invalidEmail).toBeDisplayed();
      await expect(invalidEmail).toHaveText("Email format is invalid");

    });

    it("I should remain on the login page", async () => {

      await LoginPage.login(invalidFormat.email, invalidFormat.password);
      await expect(browser).toHaveUrl(expect.stringContaining("login"));

    });

  });

});
