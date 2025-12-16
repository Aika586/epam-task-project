import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../../pageObjects/pages/login.page.js';
import { browser, expect } from '@wdio/globals';
import { invalidUser, invalidFormat, user } from '../../data/userData';

// Map userType to credentials
const userMap = {
  invalidUser,
  invalidFormat,
  // Add more as needed
};

const errorLocatorMap = {
  duplicateUser: LoginPage.loginErrorMessage,
  invalidFormat: LoginPage.invalidEmailError,
  // Add more mappings as needed
};

let currentUserType = '';

Given(/^I am on the sign in page$/, async () => {
  await LoginPage.open();
});

When(/^I provide valid login credentials$/, async () => {
  // Replace with your valid user data
  await LoginPage.login(user.email, user.password);
});

When(/^I login with "([^"]*)"$/, async (userType) => {
  currentUserType = userType;
  const testUser = userMap[userType];
  await LoginPage.login(testUser.email, testUser.password);
});

When(
  /^I attempt to log in without providing both email and password$/,
  async () => {
    await LoginPage.login('', '');
  }
);

// Positive scenario
Then(/^I should be redirected to my account page$/, async () => {
  await expect(browser).toHaveUrl(expect.stringContaining('account'));
});
Then(/^my session should be active for future requests$/, async () => {
  const cookies = await browser.getCookies();
  const sessionCookie = cookies.find((cookie) => cookie.name === 'session');
  await expect(sessionCookie).not.toBeUndefined();
});

// Negative scenario outline: error message
Then(/^I should see an login error message "([^"]*)"$/, async (message) => {
  const errorElement = errorLocatorMap[currentUserType];
  await expect(await errorElement).toBeDisplayed();
  await expect(await errorElement).toHaveText(message);
});

// Negative scenario: remain on sign-in page
Then(/^I should remain on the signin page$/, async () => {
  await expect(browser).toHaveUrl(expect.stringContaining('login'));
});

// Negative scenario: missing fields error
Then(/^I should see an error message elements$/, async () => {
  // Check all error elements are displayed
  const errorElements = await(LoginPage.missingFieldError);
  for (const el of errorElements) {
    await expect(el).toBeDisplayed();
  }
  await expect(LoginPage.inputUsername).toHaveAttribute('aria-invalid', 'true');
  await expect(LoginPage.inputPassword).toHaveAttribute('aria-invalid', 'true');
});

// Negative scenario: missing fields highlighted
Then(
  /^the missing email and password fields should be highlighted$/,
  async () => {
    await expect(LoginPage.inputUsername).toHaveAttribute(
      'aria-invalid',
      'true'
    );
    await expect(LoginPage.inputPassword).toHaveAttribute(
      'aria-invalid',
      'true'
    );
  }
);

// Alias for sign-in page check

