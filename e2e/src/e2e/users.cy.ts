import {
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
import { Method } from 'cypress/types/net-stubbing';

describe('users', () => {
  before(() => {
    cy.visit('/').loginWithoutSession(TEST_USERNAME, TEST_PASSWORD);

    cy.addNewTransaction({
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
    cy.intercept(
      'POST' as Method,
      'https://keycloak.127.0.0.1.nip.io/realms/expense-tracker-realm/login-actions/authenticate*',
    ).as('apiCheckAuth');

    getUsernameLink().click();
    getUserInviteLink().click();

    getUserEmailInput().type(TEST_GUEST_EMAIL);
    getInviteButton().click();

    getUserList().should('contain', TEST_GUEST_EMAIL);

    cy.logout();

    cy.loginWithoutSession(TEST_GUEST_EMAIL, TEST_PASSWORD);

    cy.wait('@apiCheckAuth').then((interception) => {
      const responseBody = interception?.response?.body;

      // TODO register is not working, it redirects to login contrary to manual flow
      if (responseBody.toString().includes('Invalid username or password')) {
        cy.register(TEST_GUEST_EMAIL, TEST_PASSWORD);
        cy.confirmRegistration();
      }

      getUsernameLink().should('contain', TEST_GUEST_USERNAME);

      getTransactionMenu().click();

      getFirstAmountCell().should('contain.text', '-100');
    });
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
