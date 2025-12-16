@signup @ui
Feature: User Sign Up
  As a user
  I want to be able to sign up
  So that I can access my account

  Background:
    Given I am on the sign up page

  @positive
  Scenario: Successful sign up
    When I register with valid details
    Then I should be redirected to the login page
 
  @negative
  Scenario Outline: Registration fails due to invalid input
    When I register with "<userType>"
    Then I should see an error message "<errorMessage>"
    And I should remain on the sign up page

    Examples:
      | userType      | errorMessage                                       |
      | duplicateUser | A customer with this email address already exists. |
      | invalidFormat | Email format is invalid                            |

  @negative
  Scenario: Missing required fields
    When I attempt to register without providing any of the required fields
    Then I should see an error elements
    And the missing fields should be highlighted
