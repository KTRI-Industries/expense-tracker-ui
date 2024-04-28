import {
  getAddTransactionButton,
  getTransactionMenu,
} from '../support/navigation-menu.po';
import { getCreateTransactionButton } from '../support/transaction-form.po';

const TEST_USERNAME = 'test_user';
const TEST_PASSWORD = 'open123';

describe('transactions', () => {
  beforeEach(() => cy.visit('/'));

  it('should display transactions page', () => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);

    getTransactionMenu().click();

    getAddTransactionButton().should('be.visible');
  });

  it('should add a transaction', () => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);

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
    cy.get('mat-table :nth-child(2) > .justify-end').should(
      'contain.text',
      '-100',
    );
  });
});
