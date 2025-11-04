import LoginPage from "../pageObjects/pages/login.page";
import { user, invalidFormat, invalidUser } from "../data/userData";
import { browser, expect } from "@wdio/globals";

describe("Login Tests", () => {

  describe("Successful login", () => {
    before(async () => {
      await LoginPage.open();
      await LoginPage.login(user.email, user.password);
    });

    it("should redirect to my account page", async () => {
      await expect(browser).toHaveUrl(expect.stringContaining("account"));
    });

    it("should keep the session active", async () => {
      const cookies = await browser.getCookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      await expect(sessionCookie).not.toBeUndefined();
    });
  });

  describe("Missing email and password", () => {
    before(async () => {
      await LoginPage.open();
      await LoginPage.login("", "");
    });

    it("should show error elements", async () => {
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        await expect(el).toBeDisplayed();
      }
    });

    it("should highlight invalid fields", async () => {
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
    before(async () => {
      await LoginPage.open();
      await LoginPage.login(invalidUser.email, invalidUser.password);
    });

    it("should show invalid login error message", async () => {
      const errorMessageElement = await LoginPage.loginErrorMessage;
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText("Invalid email or password");
    });

    it("should not create a session", async () => {
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(sessionCookie.length).toBe(0);
    });
  });

  describe("Invalid email format", () => {
    before(async () => {
      await LoginPage.open();
      await LoginPage.login(invalidFormat.email, invalidFormat.password);
    });

    it("should show invalid email format error", async () => {
      const invalidEmail = await LoginPage.invalidEmailError;
      await expect(invalidEmail).toBeDisplayed();
      await expect(invalidEmail).toHaveText("Email format is invalid");
    });
  });
});
