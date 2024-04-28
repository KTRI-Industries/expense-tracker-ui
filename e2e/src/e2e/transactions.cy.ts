import { getTransactionMenu } from '../support/navigation-menu.po';
import {
  getCreateTransactionButton,
  getDeleteTransactionButton, getDescriptionInput,
} from '../support/transaction-form.po';
import {
  getAddTransactionButton,
  getFirstAmountCell,
  getFirstDescriptionCell,
} from '../support/transactions.po';

const TEST_USERNAME = 'test_user';
const TEST_PASSWORD = 'open123';

describe('transactions', () => {
  beforeEach(() => cy.visit('/').login(TEST_USERNAME, TEST_PASSWORD));

  it('should display transactions page', () => {
    getTransactionMenu().click();

    getAddTransactionButton().should('be.visible');
  });

  it('should add a transaction', () => {
    getTransactionMenu().click();

    getAddTransactionButton().click();

    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    // CAUTION: intercept should be before the action that triggers the request!!!
    cy.intercept('POST', '/transactions').as('apiCheck');

    getCreateTransactionButton().click();

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
      expect(interception?.response?.body.amount.amount).to.eq(-100);
    });

    // make sure we re back to the tx list page and the new tx is showing in the table
    getAddTransactionButton().should('be.visible');

    getFirstAmountCell().should('contain.text', '-100');
  });

  it('should delete a transaction', () => {
    getTransactionMenu().click();
    getAddTransactionButton().click();

    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    getCreateTransactionButton().click();

    getFirstDescriptionCell().click();

    // CAUTION: intercept should be before the action that triggers the request!!!
    cy.intercept('GET', '/transactions?page=0&size=5&sort=date%2Cdesc').as(
      'apiCheck',
    );

    getDeleteTransactionButton().click();

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
    });
  });

  it.only('should not create an invalid transaction', () => {

    getTransactionMenu().click();
    getAddTransactionButton().click();

    cy.addNewTransaction({
      amount: -100,
      date: '28/04/2024',

    });

    getCreateTransactionButton().click();

    getDescriptionInput()
      .should('have.class', 'ng-invalid');
  });

  afterEach(() => {
    cy.deleteVisibleTransactions();
  });
});
