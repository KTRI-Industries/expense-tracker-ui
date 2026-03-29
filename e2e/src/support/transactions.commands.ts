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
import { getTransactionMenu } from './navigation-menu.po';
import {
  getAddRecurrentTransactionButton,
  getCreateRecurrentTransactionButton,
  getDeleteRecurrentTransactionButton,
  getFirstRecurrentDescriptionCell,
  getRecurrentAmountInput,
  getRecurrentDescriptionInput,
  getRecurrentStartDatePicker,
  getRecurrentTransactionTab,
  hasRecurrentTransactionInTable,
} from './recurrent-transactions.po';
import { RecurrentTransactionDraft, TransactionDraft } from './models';

export function registerTransactionCommands(): void {
  Cypress.Commands.add('addNewTransaction', (transaction: TransactionDraft) => {
    getTransactionMenu().click();
    getAddTransactionButton().click();

    getAmountInput().type(`${transaction.amount}`, { force: true });
    getDatePicker().type(transaction.date);

    if (transaction.description !== undefined) {
      getDescriptionInput().type(transaction.description, { force: true });
    }

    getCreateTransactionButton().click();
  });

  Cypress.Commands.add('editTransaction', (transaction: TransactionDraft) => {
    getAmountInput().clear().type(`${transaction.amount}`, { force: true });
    getDatePicker().clear().type(transaction.date);
    if (transaction.description !== undefined) {
      getDescriptionInput()
        .clear({ force: true })
        .type(transaction.description, { force: true });
    }
  });

  Cypress.Commands.add('deleteVisibleTransactions', () => {
    cy.visit('transactions-page/transactions');
    cy.intercept('GET', '/transactions*').as('apiCheck');

    cy.wait('@apiCheck').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);

      doDeleteTransactions();
    });
  });

  Cypress.Commands.add(
    'addNewRecurrentTransaction',
    (transaction: RecurrentTransactionDraft) => {
      getTransactionMenu().click();
      getRecurrentTransactionTab().click();
      getAddRecurrentTransactionButton().click();

      getRecurrentAmountInput().type(`${transaction.amount}`, { force: true });
      getRecurrentStartDatePicker().type(transaction.date, { force: true });

      if (transaction.description !== undefined) {
        getRecurrentDescriptionInput().type(transaction.description, {
          force: true,
        });
      }

      getCreateRecurrentTransactionButton().click();
    },
  );

  Cypress.Commands.add(
    'editRecurrentTransaction',
    (transaction: RecurrentTransactionDraft) => {
      getRecurrentAmountInput().clear().type(`${transaction.amount}`, {
        force: true,
      });
      getRecurrentStartDatePicker().clear().type(transaction.date);
      if (transaction.description !== undefined) {
        getRecurrentDescriptionInput()
          .clear({ force: true })
          .type(transaction.description, { force: true });
      }
    },
  );

  Cypress.Commands.add('deleteVisibleRecurrentTransactions', () => {
    cy.visit('transactions-page/recurrent-transactions');
    cy.intercept('GET', '/recurrent-transactions*').as('apiCheckRecurrent');

    cy.wait('@apiCheckRecurrent').then((interception) => {
      expect(interception?.response?.statusCode).to.eq(200);

      doDeleteRecurrentTransactions();
    });
  });
}

function doDeleteTransactions(): void {
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
          doDeleteTransactions();
        });
      }
    });
  });
}

function doDeleteRecurrentTransactions(): void {
  hasRecurrentTransactionInTable().then((hasTx) => {
    if (!hasTx) {
      return;
    }
    getFirstRecurrentDescriptionCell().then(($el) => {
      if ($el.is(':visible')) {
        $el.click();

        getDeleteRecurrentTransactionButton().click();

        cy.wait('@apiCheckRecurrent').then((interception) => {
          expect(interception?.response?.statusCode).to.eq(200);
          doDeleteRecurrentTransactions();
        });
      }
    });
  });
}
