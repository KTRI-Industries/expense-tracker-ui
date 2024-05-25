import { TEST_PASSWORD, TEST_USERNAME } from './app.cy';
import { getUsernameLink } from '../support/app.po';
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
    cy.visit('/').login(TEST_USERNAME, TEST_PASSWORD);

    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    getFirstAmountCell().should('contain.text', '-100');

    cy.logout();
  });

  beforeEach(() => cy.visit('/').login(TEST_USERNAME, TEST_PASSWORD));

  it('should display users page with invite link', () => {
    getUsernameLink().click();
    getUserInviteLink().should('be.visible');
  });

  it('should invite new user', () => {
    getUsernameLink().click();
    getUserInviteLink().click();

    getUserEmailInput().type('test@test.com');
    getInviteButton().click();

    getUserList().should('contain', 'test@test.com');
  });

  it('should invite user and invited user should login', () => {
    getUsernameLink().click();
    getUserInviteLink().click();

    getUserEmailInput().type('test2@test.com');
    getInviteButton().click();

    getUserList().should('contain', 'test2@test.com');

    // TODO login if user already exists otherwise register

    cy.logout();

    cy.login('test2@test.com', TEST_PASSWORD);

    getUsernameLink().then(($link) => {
      if ($link.length) {
        // If the username link exists,do nothing it means user is already registered
      } else {
        // If the username link does not exist, attempt to register
        cy.register('test2@test.com', TEST_PASSWORD);
        cy.confirmRegistration();
      }
    });

    getUsernameLink().should('contain', 'test2@test.com');

    getTransactionMenu().click();

    getFirstAmountCell().should('contain.text', '-100');
  });

  afterEach(() => {
    cy.deleteAllInvitedUsers();
  });

  after(() => {
    getTransactionMenu().click();
    cy.deleteVisibleTransactions();
  });
});
