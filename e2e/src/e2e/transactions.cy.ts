import { getTransactionMenu } from '../support/navigation-menu.po';
import {
  getDeleteTransactionButton,
  getDescriptionInput,
  getUpdateTransactionButton,
} from '../support/transaction-form.po';
import {
  getAddTransactionButton,
  getFirstAmountCell,
  getFirstDescriptionCell,
} from '../support/transactions.po';
import { TEST_PASSWORD, TEST_USERNAME } from '../support/app.po';

describe('transactions', () => {
  beforeEach(() => {
    cy
      // .visit('/')
      .login(TEST_USERNAME, TEST_PASSWORD);
    cy.visit('/');
  });

  it('should display transactions page', () => {
    getTransactionMenu().click();

    getAddTransactionButton().should('be.visible');
  });

  it('should add a transaction', () => {
    // CAUTION: intercept should be before the action that triggers the request!!!
    cy.intercept('POST', '/transactions').as('apiCheck');

    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
      expect(interception?.response?.body.amount.amount).to.eq(-100);
    });

    // make sure we re back to the tx list page and the new tx is showing in the table
    getAddTransactionButton().should('be.visible');

    getFirstAmountCell().should('contain.text', '-100');
  });

  it('should delete a transaction', () => {
    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

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

  it('should not create an invalid transaction', () => {
    cy.addNewTransaction({
      amount: -100,
      date: '28/04/2024',
    });

    getDescriptionInput().should('have.class', 'ng-invalid');
  });

  afterEach(() => {
    cy.deleteVisibleTransactions();
  });

  it('should edit existing transaction', () => {
    cy.addNewTransaction({
      amount: 100,
      date: '28/04/2024',
      description: 'Test transaction',
    });

    getFirstDescriptionCell().click();

    cy.intercept('PUT', '/transactions/*').as('apiCheck');

    cy.editTransaction({
      amount: 200,
      date: '28/04/2024',
      description: 'Updated transaction',
    });

    getUpdateTransactionButton().click();

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
      expect(interception?.response?.body.amount.amount).to.eq(-200);
      expect(interception?.response?.body.description).to.eq(
        'Updated transaction',
      );
    });

    getFirstAmountCell().should('contain.text', '-200');
  });
});
