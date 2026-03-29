import {
  getAccountsTab,
  getUsernameLink,
  TEST_GUEST_EMAIL,
  TEST_PASSWORD,
} from '../support/app.po';
import {
  getSetDefaultTenantButtonForOwner,
  getSwitchTenantButtonForOwner,
} from '../support/accounts.po';
import { setupGuestWithTwoAccounts } from '../support/accounts.fixture';
import { getTransactionMenu } from '../support/navigation-menu.po';

const OWNER_TRANSACTION_DESCRIPTION = 'Owner tenant transaction';
const GUEST_TRANSACTION_DESCRIPTION = 'Guest tenant transaction';

describe('accounts', () => {
  before(() => {
    cy.then(Cypress.session.clearCurrentSessionData);
  });

  beforeEach(() => {
    setupGuestWithTwoAccounts({
      ownerTransactionDescription: OWNER_TRANSACTION_DESCRIPTION,
      guestTransactionDescription: GUEST_TRANSACTION_DESCRIPTION,
    });
  });

  it('should switch to another account and show that account transactions', () => {
    getUsernameLink().click();
    getAccountsTab().click();

    getSwitchTenantButtonForOwner(TEST_GUEST_EMAIL).click();

    getTransactionMenu().click();

    cy.contains(
      '[data-cy="transaction-description-cell"]',
      GUEST_TRANSACTION_DESCRIPTION,
    ).should('be.visible');
    cy.contains(
      '[data-cy="transaction-description-cell"]',
      OWNER_TRANSACTION_DESCRIPTION,
    ).should('not.exist');
  });

  it('should set another account as default and keep it after re-login', () => {
    getUsernameLink().click();
    getAccountsTab().click();

    cy.get('[data-cy="set-default-tenant-button"]:visible').first().click();

    cy.logout();

    cy.visit('/').loginWithoutSession(TEST_GUEST_EMAIL, TEST_PASSWORD);
    getTransactionMenu().click();

    cy.contains(
      '[data-cy="transaction-description-cell"]',
      OWNER_TRANSACTION_DESCRIPTION,
    ).should('be.visible');

    getUsernameLink().click();
    getAccountsTab().click();
    cy.get('[data-cy="set-default-tenant-button"]:visible').first().click();
  });

  afterEach(() => {
    cy.get('body').then(($body) => {
      if ($body.find('[data-cy="logout-button"]:visible').length > 0) {
        cy.logout();
      }
    });
  });
});
