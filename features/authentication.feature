Feature: Authentication
  As a user
  I want to be able to sign up and sign in
  So that I can access my account

  Scenario: Successful sign up
    Given I am on the sign up page
    When I register with valid details
    Then I should see a confirmation message "Account created successfully"
    And I should be redirected to the login page
    And my account should be stored in the database

  Scenario: Invalid email format
    Given I am on the sign up page
    When I register with an invalid email address
    Then I should see an invalid email error message "Invalid email format"
    And the email field should be highlighted
    And my account should not be created

  Scenario: Email is already registered
    Given I am on the sign up page
    When I register with an email that is already in use
    Then I should see a duplicate account error message "A customer with this email address already exists."
    And I should remain on the sign-up page
    And my account should not be created

  Scenario: Missing required fields
    Given I am on the sign up page
    When I attempt to register without providing any of the required fields
    Then I should see an error elements
    And the missing fields should be highlighted
    And I should remain on the signup page

  Scenario: Successful sign in
    Given I am on the sign in page
    When I provide valid login credentials
    Then I should be redirected to my account page
    And my session should be active for future requests

  Scenario: Invalid credentials
    Given I am on the sign in page
    When I log in with an incorrect email or password
    Then I should see a login error message "Invalid email or password"
    And I should remain on the sign-in page
    And my session should not be created

  Scenario: Missing email and password
    Given I am on the sign in page
    When I attempt to log in without providing both email and password
    Then I should see an error message "Email and password are required."
    And the missing email and password fields should be highlighted
    And I should remain on the signin page

  Scenario: Invalid email format during login in
    Given I am on the sign in page
    When I login with an invalid email address
    Then I should see an email invalid format error message "Email format is invalid"
    And I should remain on the signIn page



