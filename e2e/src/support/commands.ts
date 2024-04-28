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
  getDescriptionInput,
} from './transaction-form.po';

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
  getAmountInput().type('100', { force: true });
  getDatePicker().type('28/04/2024');
  getDescriptionInput().type('Test transaction', { force: true });
});
