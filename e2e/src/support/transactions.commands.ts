import {
  getAmountInput,
  getCreateTransactionButton,
  getDatePicker,
  getDescriptionInput,
} from './transaction-form.po';
import { getAddTransactionButton } from './transactions.po';
import { getTransactionMenu } from './navigation-menu.po';
import {
  getAddRecurrentTransactionButton,
  getCreateRecurrentTransactionButton,
  getRecurrentAmountInput,
  getRecurrentDescriptionInput,
  getRecurrentStartDatePicker,
  getRecurrentTransactionTab,
} from './recurrent-transactions.po';
import { RecurrentTransactionDraft, TransactionDraft } from './models';
import {
  deleteAllRecurrentTransactionsByApi,
  deleteAllTransactionsByApi,
} from './api.commands';

export function registerTransactionCommands(): void {
  Cypress.Commands.add('addNewTransaction', (transaction: TransactionDraft) => {
    getTransactionMenu().click();
    getAddTransactionButton().click();

    getAmountInput().type(`${transaction.amount}`, { force: true });
    getDatePicker().type(transaction.date, { force: true });

    if (transaction.description !== undefined) {
      getDescriptionInput().type(transaction.description, { force: true });
    }

    getCreateTransactionButton().click();
  });

  Cypress.Commands.add('editTransaction', (transaction: TransactionDraft) => {
    getAmountInput().clear().type(`${transaction.amount}`, { force: true });
    getDatePicker().clear().type(transaction.date, { force: true });
    if (transaction.description !== undefined) {
      getDescriptionInput()
        .clear({ force: true })
        .type(transaction.description, { force: true });
    }
  });

  Cypress.Commands.add('deleteVisibleTransactions', () => {
    deleteAllTransactionsByApi();
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
      getRecurrentStartDatePicker().clear().type(transaction.date, { force: true });
      if (transaction.description !== undefined) {
        getRecurrentDescriptionInput()
          .clear({ force: true })
          .type(transaction.description, { force: true });
      }
    },
  );

  Cypress.Commands.add('deleteVisibleRecurrentTransactions', () => {
    deleteAllRecurrentTransactionsByApi();
  });
}
