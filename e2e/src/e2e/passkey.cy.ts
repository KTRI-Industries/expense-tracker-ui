import {
  getUsernameLink,
  TEST_PASSWORD,
  TEST_USERNAME,
} from '../support/app.po';

describe('passkey prompt', () => {
  before(() => {
    cy.then(Cypress.session.clearCurrentSessionData);
  });

  beforeEach(() => {
    cy.intercept(
      'GET',
      '**/account/credentials?type=webauthn-passwordless*',
      [],
    ).as('getPasskeyCredentials');

    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.removeItem('passkey-prompt-dismissed');
    });
  });

  it('should show the passkey prompt once and suppress it after "Don\'t ask again"', () => {
    cy.loginWithoutPasskeyDismissal(TEST_USERNAME, TEST_PASSWORD);

    cy.wait('@getPasskeyCredentials')
      .its('response.statusCode')
      .should('eq', 200);

    cy.get('[data-cy="passkey-dont-ask"]').should('be.visible').click();
    cy.get('[data-cy="passkey-dont-ask"]').should('not.exist');
    cy.window().should((win) => {
      expect(win.localStorage.getItem('passkey-prompt-dismissed')).to.eq('true');
    });

    cy.logout();

    cy.visit('/');
    cy.loginWithoutPasskeyDismissal(TEST_USERNAME, TEST_PASSWORD);
    getUsernameLink().should('be.visible');

    cy.get('[data-cy="passkey-dont-ask"]').should('not.exist');
  });

  afterEach(() => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="logout-button"]:visible').length > 0) {
        cy.logout();
      }
    });
  });
});
