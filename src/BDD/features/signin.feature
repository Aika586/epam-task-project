@signin @ui
Feature: User Sign In
  As a user
  I want to be able to sign in
  So that I can access my account

  Background:
    Given I am on the sign in page

  @positive
  Scenario: Successful sign in
    When I provide valid login credentials
    Then I should be redirected to my account page
    And my session should be active for future requests

  @negative
  Scenario Outline: Login fails due to invalid input
    When I login with "<userType>"
    Then I should see an login error message "<errorMessage>"
    And I should remain on the signin page

    Examples:
      | userType      | errorMessage              |
      | invalidUser   | Invalid email or password |
      | invalidFormat | Email format is invalid   |

  @negative
  Scenario: Missing email and password
    When I attempt to log in without providing both email and password
    Then I should see an error message elements
    And the missing email and password fields should be highlighted
    And I should remain on the signin page
