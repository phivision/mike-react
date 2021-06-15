import { testCustomer } from "./testCredentials";

const selectors = {
  // Auth component classes
  emailInput: '[data-test="email-input"]',
  passwordInput: '[data-test="password-input"]',
  signInButton: '[data-test="sign-in-button"]',
};

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

describe("Authenticator:", function () {
  // Step 1: setup the application state
  beforeEach(function () {
    cy.visit("/signin");
  });

  describe("Sign In:", () => {
    it("allows a user to signin", () => {
      // Step 2: Take an action (Sign in)
      cy.get(selectors.emailInput).type(testCustomer.email);
      cy.get(selectors.passwordInput).type(testCustomer.password);
      cy.get(selectors.signInButton).contains("Sign In").click();

      cy.contains("Feed");
    });
  });
});
