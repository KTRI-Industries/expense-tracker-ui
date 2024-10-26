import { TEST_PASSWORD, TEST_USERNAME } from '../support/app.po';
import { getTransactionMenu } from '../support/navigation-menu.po';
import {
  getAddRecurrentTransactionButton,
  getFirstRecurrentAmountCell,
  getRecurrentTransactionTab,
} from '../support/recurrent-transactions.po';
import {
  getFirstAmountCell,
  getFirstDescriptionCell,
} from '../support/transactions.po';
import { getUpdateTransactionButton } from '../support/transaction-form.po';

describe.only('recurrent transactions', () => {
  before(() => {
    // ensure clean test slate for these tests
    cy.then(Cypress.session.clearCurrentSessionData);
  });

  beforeEach(() => {
    cy
      // .visit('/')
      .login(TEST_USERNAME, TEST_PASSWORD);
    cy.visit('/');
  });

  it('should display recurrent transactions page', () => {
    getTransactionMenu().click();
    getRecurrentTransactionTab().click();

    getAddRecurrentTransactionButton().should('be.visible');
  });

  it('should add a recurrent transaction', () => {
    // CAUTION: intercept should be before the action that triggers the request!!!
    cy.intercept('POST', '/recurrent-transactions').as('apiCheck');

    cy.addNewRecurrentTransaction({
      amount: 100,
      date: new Date().toLocaleDateString('el-GR'),
      description: 'Test transaction',
    });

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);
      expect(interception?.response?.body.amount.amount).to.eq(-100);
    });

    // make sure we re back to the tx list page and the new tx is showing in the table
    getAddRecurrentTransactionButton().should('be.visible');

    getFirstRecurrentAmountCell().should('contain.text', '-100');

    getTransactionMenu().click();
    getFirstAmountCell();
  });

  afterEach(() => {
    cy.deleteVisibleTransactions();
    getRecurrentTransactionTab().click();
    cy.deleteVisibleRecurrentTransactions();
  });

  it('should edit existing recurrent transaction', () => {
    cy.addNewRecurrentTransaction({
      amount: 100,
      date: new Date().toLocaleDateString('el-GR'),
      description: 'Test transaction',
    });

    getFirstDescriptionCell().click();

    cy.intercept('PUT', '/recurrent-transactions/*').as('apiCheck');

    cy.editRecurrentTransaction({
      amount: 200,
      date: new Date().toLocaleDateString('el-GR'),
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
