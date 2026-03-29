import {
  getAccountsTab,
  getUsernameLink,
  TEST_GUEST_EMAIL,
  TEST_GUEST_USERNAME,
  TEST_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USERNAME,
} from '../support/app.po';
import {
  getInviteButton,
  getUserEmailInput,
  getUserInviteLink,
  getUserList,
} from '../support/user-page.po';
import { getTransactionMenu } from '../support/navigation-menu.po';
import { getFirstAmountCell } from '../support/transactions.po';

describe('users', () => {
  before(() => {
    cy.visit('/').loginWithoutSession(TEST_USERNAME, TEST_PASSWORD);
    cy.deleteAllInvitedUsers();
    cy.deleteVisibleTransactions();
    cy.seedTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    getFirstAmountCell().should('contain.text', '-100');

    cy.logout();
  });

  beforeEach(() =>
    cy.visit('/').loginWithoutSession(TEST_USERNAME, TEST_PASSWORD),
  );

  it('should display users page with invite link', () => {
    getUsernameLink().click();
    getUserInviteLink().should('be.visible');
  });

  it('should invite new user', () => {
    getUsernameLink().click();
    getUserInviteLink().click();

    getUserEmailInput().type(TEST_USER_EMAIL);
    getInviteButton().click();

    getUserList().should('contain', TEST_USER_EMAIL);
  });

  it('should invite user and invited user should login', () => {
    getUsernameLink().click();
    getUserInviteLink().click();

    getUserEmailInput().type(TEST_GUEST_EMAIL);
    getInviteButton().click();

    getUserList().should('contain', TEST_GUEST_EMAIL);

    cy.logout();
    cy.loginWithoutSession(TEST_GUEST_EMAIL, TEST_PASSWORD);
    getUsernameLink().should('contain', TEST_GUEST_USERNAME);

    getUsernameLink().click();

    getAccountsTab().click();

    cy.acceptInvitation();

    getTransactionMenu().click();

    getFirstAmountCell().should('contain.text', '-100');

    cy.leaveTenant();
  });

  afterEach(() => {
    cy.logout();
    cy.loginWithoutSession(TEST_USERNAME, TEST_PASSWORD);

    cy.deleteAllInvitedUsers();
  });

  after(() => {
    cy.deleteVisibleTransactions();
  });
});
