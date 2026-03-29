import { getLoginButton } from './app.po';
import { KEYCLOAK_URL, MAILHOG_URL } from './test-config';

export function registerAuthCommands(): void {
  Cypress.Commands.add('dismissPasskeyPrompt', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('passkey-prompt-dismissed', 'true');
    });
  });

  Cypress.Commands.add('login', (email, password) => {
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
  });

  Cypress.Commands.add('register', (email, password) => {
    cy.origin(
      KEYCLOAK_URL,
      { args: { email, password } },
      ({ email, password }) => {
        cy.get('#kc-registration a').click();
        cy.get('#username').type(email);
        cy.get('#password').type(password);
        cy.get('#password-confirm').type(password);
        cy.get('#email').type(email);
        cy.get('#firstName').type(email);
        cy.get('#lastName').type(email);
        cy.get('input[value="Register"]').click();
      },
    );
  });

  Cypress.Commands.add('confirmRegistration', () => {
    cy.request(`${MAILHOG_URL}/api/v2/messages?limit=50`).then((response) => {
      const email = response.body.items[0];
      const emailBody = email.Content.Body;
      const linkRegex = /(https?:\/\/[^\s]*)/;
      const match = emailBody.match(linkRegex);

      if (!match) {
        return;
      }

      cy.request({
        url: match[0],
        followRedirect: false,
      }).then((firstRedirect) => {
        expect(firstRedirect.status).to.eq(302);
        const firstLocation = firstRedirect.headers['location'] as string;

        cy.request({
          url: firstLocation,
          followRedirect: false,
        }).then((secondRedirect) => {
          expect(secondRedirect.status).to.eq(302);
          const secondLocation = secondRedirect.headers['location'] as string;
          cy.visit(secondLocation);
        });
      });
    });
  });
}
