import {
  getAccountsTab,
  TEST_GUEST_EMAIL,
  TEST_PASSWORD,
  TEST_USERNAME,
} from './app.po';
import { getTransactionMenu } from './navigation-menu.po';
import {
  getInviteButton,
  getUserEmailInput,
  getUserInviteLink,
  getUserList,
} from './user-page.po';
import { getUsernameLink } from './app.po';

interface AccountFixtureOptions {
  ownerTransactionDescription: string;
  guestTransactionDescription: string;
}

export function setupGuestWithTwoAccounts({
  ownerTransactionDescription,
  guestTransactionDescription,
}: AccountFixtureOptions) {
  cy.visit('/').loginWithoutSession(TEST_USERNAME, TEST_PASSWORD);
  cy.deleteAllInvitedUsers();
  cy.deleteVisibleTransactions();

  cy.seedTransaction({
    amount: -100,
    date: '28/04/2024',
    description: ownerTransactionDescription,
  });

  getUsernameLink().click();
  getUserInviteLink().click();

  getUserEmailInput().type(TEST_GUEST_EMAIL);
  getInviteButton().click();
  getUserList().should('contain', TEST_GUEST_EMAIL);

  cy.logout();

  cy.visit('/').loginWithoutSession(TEST_GUEST_EMAIL, TEST_PASSWORD);
  cy.deleteVisibleTransactions();
  cy.seedTransaction({
    amount: -200,
    date: '29/04/2024',
    description: guestTransactionDescription,
  });

  getUsernameLink().click();
  getAccountsTab().click();

  cy.acceptInvitation();

  getTransactionMenu().click();
  cy.contains(
    '[data-cy="transaction-description-cell"]',
    ownerTransactionDescription,
  ).should('be.visible');
}
