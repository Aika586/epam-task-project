const { Given, When, Then } = require("@wdio/cucumber-framework");
const { expect } = require("@wdio/globals");

Given("I am on the sign up page", async function () {
  await browser.url("/auth/register");
});

When("I register with valid details", async function () {
  await $("#first_name").setValue("John");
  await $("#last_name").setValue("Doe");
  await $("#dob").setValue("1990-01-01");
  await $("#street").setValue("Chui");
  await $("#postal_code").setValue("720019");
  await $("#city").setValue("Bishkek");
  await $("#state").setValue("no-state");
  await $("#country").selectByVisibleText("Kyrgyzstan");
  await $("#phone").setValue("0707707707");
  await $("#email").setValue("aika_user@gmail.com");
  await $("#password").setValue("Password123!");
  await $('//form//button[@type="submit"]').click();
});

Then(
  "I should see a confirmation message {string}",
  async function (expectedMessage) {
    await browser.waitUntil(
      async () => (await browser.getAlertText()) === expectedMessage,
      {
        timeout: 5000,
        timeoutMsg: "Expected alert did not appear.",
      }
    );
    const alertText = await browser.getAlertText();
    await expect(alertText).toEqual(expectedMessage);
    await browser.acceptAlert();
  }
);

Then("I should be redirected to the login page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("login"));
});

Then("my account should be stored in the database", async function () {
  // Normally, should call a backend API to verify this.
  console.log("Account stored in database check (mock implementation)");
});

When("I register with an invalid email address", async function () {
  await $("#first_name").setValue("John");
  await $("#last_name").setValue("Doe");
  await $("#dob").setValue("1990-01-01");
  await $("#street").setValue("Chui St.");
  await $("#postal_code").setValue("12345");
  await $("#city").setValue("Bishkek");
  await $("#state").setValue("Kyrgyzstan");
  await $("#country").selectByVisibleText("Kyrgyzstan");
  await $("#phone").setValue("0707707707");
  await $("#email").setValue("not-an-email"); // Invalid email format
  await $("#password").setValue("Password1235!");
  await $('//form//button[@type="submit"]').click();
});

Then(
  "I should see an invalid email error message {string}",
  async function (errorInvalid) {
    const alertElement = await $("//div[@data-test='email-error']");
    await expect(alertElement).toBeDisplayed();
    await expect(alertElement).toHaveText(errorInvalid);
  }
);

Then("the email field should be highlighted", async function () {
  const emailField = await $("#email");
  await browser.waitUntil(
    async () => (await emailField.getAttribute("aria-invalid")) === "true",
    { timeout: 3000, timeoutMsg: "Email aria-invalid not set" }
  );
  await expect(emailField).toHaveAttribute("aria-invalid", "true");
});

Then("my account should not be created", async function () {
  // Mock implementation: Check if the invalid email prevented account creation.
  console.log(
    "Account existence check in database (mocked). Ensure backend logic validates email format."
  );
});

When("I register with an email that is already in use", async function () {
  await $("#first_name").setValue("Adam");
  await $("#last_name").setValue("Doe");
  await $("#dob").setValue("1998-01-01");
  await $("#street").setValue("Kiev St.");
  await $("#postal_code").setValue("12345");
  await $("#city").setValue("Bishkek");
  await $("#state").setValue("Kyrgyzstan");
  await $("#country").selectByVisibleText("Kyrgyzstan");
  await $("#phone").setValue("0707707708");
  await $("#email").setValue("aika_user@gmail.com");
  await $("#password").setValue("Password1265!");
  await $('//form//button[@type="submit"]').click();
});

Then(
  "I should see a duplicate account error message {string}",
  async function (errorMessage) {
    const errorMessageElement = await $(
      "//div[@data-test='register-error']//div[@class='help-block']"
    );
    await expect(errorMessageElement).toBeDisplayed();
    await expect(errorMessageElement).toHaveText(
      expect.stringContaining(errorMessage)
    );
  }
);

Then("I should remain on the sign-up page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("register"));
});

When(
  "I attempt to register without providing any of the required fields",
  async function () {
    await $('//form//button[@type="submit"]').click();
  }
);

Then("I should see an error elements", async function () {
  const errorMessageSelector = `//div[@data-test]`;
  const errorMessages = await $$(errorMessageSelector);
  expect(errorMessages.length).toBeGreaterThan(0);
  for (let errorMessage of errorMessages) {
    await expect(errorMessage).toBeDisplayed();
  }
});

Then("the missing fields should be highlighted", async () => {
  const fields = await $$("//input");

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

Then("I should remain on the signup page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("register"));
});

// Scenario: Successful sign in
Given("I am on the sign in page", async function () {
  await browser.url("auth/login");
});

When("I provide valid login credentials", async function () {
  await $("#email").setValue("urmataika18@gmail.com");
  await $("#password").setValue("Urmat-1988");
  await $("//form//input[@type='submit']").click();
});
Then("I should be redirected to my account page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("account"));
});
Then("my session should be active for future requests", async function () {
  const cookies = await browser.getCookies();
  console.log("Cookies: ", cookies);
  const sessionCookie = cookies.find((cookie) => cookie.name === "session");
  console.log("Session Cookie: ", sessionCookie);
  await expect(sessionCookie).not.toBeUndefined();
});

When("I log in with an incorrect email or password", async function () {
  await $("#email").setValue("invaliduser@gmail.com");
  await $("#password").setValue("WrongPassword!");
  await $("//form//input[@type='submit']").click();
});

Then(
  "I should see a login error message {string}",
  async function (errorMessage) {
    const errorMessageElement = await $("//div[@data-test='login-error']//div");
    await expect(errorMessageElement).toBeDisplayed();
    await expect(errorMessageElement).toHaveText(errorMessage);
  }
);

Then("I should remain on the sign-in page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("login"));
});

Then("my session should not be created", async function () {
  const sessionCookie = await browser.getCookies(["session_id"]);
  await expect(sessionCookie.length).toBe(0);
});

When(
  "I attempt to log in without providing both email and password",
  async function () {
    await $("//form//input[@type='submit']").click();
  }
);

Then("I should see an error message {string}", async function (errorMessage) {
  const errorMessageElements = await $$("//div[@data-test]");
  let trimmed = errorMessage.trim();
  const idx = trimmed.lastIndexOf(" ");
  let last = idx === -1 ? trimmed : trimmed.slice(idx + 1);
  last = last.replace(/[.,!?;:]+$/, "");
  await expect(errorMessageElements.length).toBeGreaterThan(0);
  for (const el of errorMessageElements) {
    await expect(el).toHaveText(expect.stringContaining(last));
  }
});

Then(
  "the missing email and password fields should be highlighted",
  async function () {
    const email = await $("#email");
    const password = await $("#password");
    await browser.waitUntil(
      async () => (await email.getAttribute("aria-invalid")) === "true",
      { timeout: 3000, timeoutMsg: "Email aria-invalid not set" }
    );
    await browser.waitUntil(
      async () => (await password.getAttribute("aria-invalid")) === "true",
      { timeout: 3000, timeoutMsg: "Password aria-invalid not set" }
    );
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(password).toHaveAttribute("aria-invalid", "true");
  }
);

Then("I should remain on the signin page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("login"));
});

When("I login with an invalid email address", async function () {
  await $("#email").setValue("invaliduser");
  await $("#password").setValue("WrongPassword!");
  await $("//form//input[@type='submit']").click();
});

Then(
  "I should see an email invalid format error message {string}",
  async function (errorMessage) {
    const errorMessageElement = await $("//div[@data-test='email-error']//div");
    await expect(errorMessageElement).toBeDisplayed();
    await expect(errorMessageElement).toHaveText(
      expect.stringContaining(errorMessage)
    );
  }
);

Then("I should remain on the signIn page", async function () {
  await expect(browser).toHaveUrl(expect.stringContaining("login"));
});
