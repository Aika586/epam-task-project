import LoginPage from "../../pageObjects/pages/login.page";
import { user, invalidFormat, invalidUser } from "../../data/userData";
import { browser, expect } from "@wdio/globals";

describe("Login Tests", () => {

  describe("Successful login", () => {

    before(async () => {
      await LoginPage.open();
    });
    
    it("Happy login to account", async () => {
      await LoginPage.login(user.email, user.password);
      await expect(browser).toHaveUrl(expect.stringContaining("account"));
      const cookies = await browser.getCookies();
      const sessionCookie = cookies.find((cookie) => cookie.name === "session");
      await expect(sessionCookie).not.toBeUndefined();
    });

  });

  describe("Missing email and password", () => {

    before(async () => {
      await LoginPage.open();
    });
    
    it("login with missing email and password", async () => {
      await LoginPage.login("", "");
      const errorElements = await LoginPage.missingFieldError;
      for (const el of errorElements) {
        await expect(el).toBeDisplayed();
      }
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
    });
    
    it("login with invalid login credentials", async () => {
      await LoginPage.login(invalidUser.email, invalidUser.password);
      const errorMessageElement = await LoginPage.loginErrorMessage;
      const sessionCookie = await browser.getCookies(["session_id"]);
      await expect(errorMessageElement).toBeDisplayed();
      await expect(errorMessageElement).toHaveText("Invalid email or password");
      await expect(sessionCookie.length).toBe(0);
    });

  });

  describe("Invalid email format", () => {

    before(async () => {
      await LoginPage.open();
    });
    
    it("login with invalid email format", async () => {
      await LoginPage.login(invalidFormat.email, invalidFormat.password);
      const invalidEmail = await LoginPage.invalidEmailError;
      await expect(invalidEmail).toBeDisplayed();
      await expect(invalidEmail).toHaveText("Email format is invalid");
    });
    
  });

});
