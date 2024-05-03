// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// eslint-disable-next-line @typescript-eslint/no-namespace
import { getLoginButton } from './app.po';
import {
  getAmountInput,
  getDatePicker,
  getDeleteTransactionButton,
  getDescriptionInput,
} from './transaction-form.po';
import {
  getFirstDescriptionCell,
  hasTransactionInTable,
} from './transactions.po';

//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  console.log('Custom command example: Login', email, password);
  getLoginButton().click();
  cy.get('#username').type(email);
  cy.get('#password').type(password);
  cy.get('#kc-login').click();
});

Cypress.Commands.add('addNewTransaction', (transaction) => {
  getAmountInput().type(transaction.amount, { force: true });
  getDatePicker().type(transaction.date);
  if (transaction.description !== undefined) {
    getDescriptionInput().type(transaction.description, { force: true });
  }
});

Cypress.Commands.add('editTransaction', (transaction) => {
  getAmountInput().clear().type(transaction.amount, { force: true });
  getDatePicker().clear().type(transaction.date);
  if (transaction.description !== undefined) {
    getDescriptionInput()
      .clear({ force: true })
      .type(transaction.description, { force: true });
  }
});

Cypress.Commands.add('deleteVisibleTransactions', () => {
  cy.intercept('GET', '/transactions?page=0&size=5&sort=date%2Cdesc').as(
    'apiCheck',
  );

  hasTransactionInTable().then((hasTx) => {
    if (!hasTx) {
      return;
    }
    getFirstDescriptionCell().then(($el) => {
      if ($el.is(':visible')) {
        $el.click();

        getDeleteTransactionButton().click();

        cy.wait('@apiCheck').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(200);
          // Call the function recursively
          cy.deleteVisibleTransactions();
        });
      }
    });
  });
});
