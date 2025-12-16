import { Given, When, Then } from '@wdio/cucumber-framework';
import SignUpPage from '../../pageObjects/pages/signUp.page.js';
import { browser, expect, $$,} from '@wdio/globals';
import {
  user,
  invalidFormat,
  duplicateUser,
} from '../../data/userData';

const userMap = {
  invalidFormat,
  duplicateUser,
};

let currentUserType = '';
const errorLocatorMap = {
  duplicateUser: SignUpPage.dublicateEmailError,
  invalidFormat: SignUpPage.invalidEmailError,
  // Add more mappings as needed
};

Given(/^I am on the sign up page$/, async () => {
  await SignUpPage.open();
});

When(/^I register with valid details$/, async () => {
  // Use userData for valid email and password
  await SignUpPage.signUp(user.email, user.password);
});

When(/^I register with "([^"]*)"$/, async (userType) => {
  currentUserType = userType;
  const testUser = userMap[userType];
  await SignUpPage.signUp(testUser.email, testUser.password);
});

When(
  'I attempt to register without providing any of the required fields',
  async () => {
    await SignUpPage.signUp('', '', true);
  }
);

Then(/^I should be redirected to the login page$/, async () => {
  await expect(browser).toHaveUrl(expect.stringContaining('login'));
});

Then(/^I should see an error message "([^"]*)"$/, async (message) => {
  const errorElement = errorLocatorMap[currentUserType];
  await expect(await errorElement).toBeDisplayed();
  await expect(await errorElement).toHaveText(message);
});
Then(/^I should remain on the sign up page$/, async () => {
  await expect(browser).toHaveUrl(expect.stringContaining('register'));
});

Then(/^I should see an error elements$/, async () => {
  const errorMessageElements = await $$(SignUpPage.missingFieldError);
  for (const el of errorMessageElements) {
    await expect(el).toBeDisplayed();
  }
});

Then(/^the missing fields should be highlighted$/, async () => {
  const fields = await $$(SignUpPage.allInputs);
  for (const field of fields) {
    await expect(field).toHaveElementClass(
      expect.stringContaining('is-invalid')
    );
  }
});
