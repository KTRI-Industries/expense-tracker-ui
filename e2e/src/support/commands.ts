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
import { getLoginButton, getUsernameLink } from './app.po';
import {
  getAmountInput,
  getCreateTransactionButton,
  getDatePicker,
  getDeleteTransactionButton,
  getDescriptionInput,
} from './transaction-form.po';
import {
  getAddTransactionButton,
  getFirstDescriptionCell,
  hasTransactionInTable,
} from './transactions.po';
import {
  getUnInviteUserButton,
  getUserEMailListElement,
  getUserList,
  hasUserExceptSelfInTable,
} from './user-page.po';
import { getTransactionMenu } from './navigation-menu.po';

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
  getTransactionMenu().click();
  getAddTransactionButton().click();

  getAmountInput().type(transaction.amount, { force: true });
  getDatePicker().type(transaction.date);

  if (transaction.description !== undefined) {
    getDescriptionInput().type(transaction.description, { force: true });
  }

  getCreateTransactionButton().click();
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

Cypress.Commands.add('deleteAllInvitedUsers', () => {
  getUsernameLink().click();
  getUserList().should('be.visible');
  cy.intercept('GET', '/users').as('apiCheck');
  hasUserExceptSelfInTable().then((hasUser) => {
    if (!hasUser) {
      return;
    }
    getUserEMailListElement().then(($el) => {
      if ($el.is(':visible')) {
        $el.click();

        getUnInviteUserButton().click();

        cy.wait('@apiCheck').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(200);
          // Call the function recursively
          cy.deleteAllInvitedUsers();
        });
      }
    });
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="logout-button"]:visible').click();
});

Cypress.Commands.add('register', (email, password) => {
  getLoginButton().click();
  cy.get('#kc-registration a').click();
  cy.get('#username').type(email);
  cy.get('#password').type(password);
  cy.get('#password-confirm').type(password);
  cy.get('#email').type(email);
  cy.get('#firstName').type(email);
  cy.get('#lastName').type(email);
  cy.get('input[value="Register"]').click();
});

/**
 * When trying to retrieve the email from the mailhog ui, I had issues with the iframes it renders so I had to use the API as a workaround.
 */
Cypress.Commands.add('confirmRegistration', () => {
  cy.intercept(
    'GET',
    'https://mailhog.127.0.0.1.nip.io/api/v2/messages?limit=50',
  ).as('getEmails');
  cy.visit('https://mailhog.127.0.0.1.nip.io/');
  cy.wait('@getEmails').then((interception) => {
    const body = JSON.parse(interception?.response?.body); // parse the JSON string into an object
    const email = body.items[0]; // get the first email
    const emailBody = email.Content.Body;
    const linkRegex = /(https?:\/\/[^\s]*)/; // regex to match the URL
    const match = emailBody.match(linkRegex); // find the URL
    if (match) {
      const url = match[0]; // get the URL from the regex match
      cy.visit(url); // visit the URL
    }
  });
});
