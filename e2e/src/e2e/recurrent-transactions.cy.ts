import { TEST_PASSWORD, TEST_USERNAME } from '../support/app.po';
import { getTransactionMenu } from '../support/navigation-menu.po';
import {
  getAddRecurrentTransactionButton,
  getFirstRecurrentAmountCell,
  getFirstRecurrentDescriptionCell,
  getRecurrentTransactionTab,
} from '../support/recurrent-transactions.po';
import { getUpdateTransactionButton } from '../support/transaction-form.po';

describe('recurrent transactions', () => {
  before(() => {
    cy.then(Cypress.session.clearCurrentSessionData);
  });

  beforeEach(() => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);
    cy.visit('/');
    cy.deleteVisibleTransactions();
    cy.deleteVisibleRecurrentTransactions();
  });

  it('should display recurrent transactions page', () => {
    getTransactionMenu().click();
    getRecurrentTransactionTab().click();

    getAddRecurrentTransactionButton().should('be.visible');
  });

  it('should add a recurrent transaction', () => {
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

    getAddRecurrentTransactionButton().should('be.visible');

    getFirstRecurrentAmountCell().should('contain.text', '-100');
  });

  it('should edit existing recurrent transaction', () => {
    cy.seedRecurrentTransaction({
      amount: 100,
      date: new Date().toLocaleDateString('el-GR'),
      description: 'Test transaction',
    });

    getTransactionMenu().click();
    getRecurrentTransactionTab().click();
    getFirstRecurrentDescriptionCell().click();

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

    getFirstRecurrentAmountCell().should('contain.text', '-200');
  });
});
