const selectors = {
  // Auth component classes
  emailInput: '[data-test="email-input"]',
  passwordInput: '[data-test="password-input"]',
  signInButton: '[data-test="sign-in-button"]',
};

//Run with npx cypress open

Cypress.on("uncaught:exception", (err, runnable) => {
  return false;
});

//NOTE: Arrow functions can't access this
describe("Authenticator:", function () {
  beforeEach(() => {
    cy.fixture("testCredentials.json").as("creds");
    cy.visit("/signin");
  });

  describe("User: ", function () {
    it("allows a user to signin", function () {
      cy.get(selectors.emailInput).type(this.creds.testCustomer.email);
      cy.get(selectors.passwordInput).type(this.creds.testCustomer.password);
      cy.get(selectors.signInButton).contains("Sign In").click();

      cy.contains("Feed");
    });
  });

  describe("Trainer: ", function () {
    it("allows a trainer to signin", function () {
      cy.get(selectors.emailInput).type(this.creds.testTrainer.email);
      cy.get(selectors.passwordInput).type(this.creds.testTrainer.password);
      cy.get(selectors.signInButton).contains("Sign In").click();

      cy.contains("Feed");
    });
  });
});
