import { getLoginButton } from './app.po';
import { KEYCLOAK_URL } from './test-config';

export function registerAuthCommands(): void {
  const rememberCurrentCredentials = (email: string, password: string) => {
    Cypress.env('currentCredentials', { email, password });
  };

  Cypress.Commands.add('dismissPasskeyPrompt', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('passkey-prompt-dismissed', 'true');
    });
  });

  Cypress.Commands.add('login', (email, password) => {
    rememberCurrentCredentials(email, password);
    cy.session([email, password], () => {
      cy.visit('/');
      cy.dismissPasskeyPrompt();
      getLoginButton().click();
      cy.origin(
        KEYCLOAK_URL,
        { args: { email, password } },
        ({ email, password }) => {
          cy.get('#username').type(email);
          cy.get('#password').type(password);
          cy.get('#kc-login').click();
        },
      );
    });
  });

  Cypress.Commands.add('loginWithoutSession', (email, password) => {
    rememberCurrentCredentials(email, password);
    cy.dismissPasskeyPrompt();
    getLoginButton().click();
    cy.origin(
      KEYCLOAK_URL,
      { args: { email, password } },
      ({ email, password }) => {
        cy.get('#username').type(email);
        cy.get('#password').type(password);
        cy.get('#kc-login').click();
      },
    );
  });

  Cypress.Commands.add('logout', () => {
    cy.get('[data-cy="logout-button"]:visible').click();
    Cypress.env('currentCredentials', null);
  });
}
