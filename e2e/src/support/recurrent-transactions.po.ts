const FIRST_DESCRIPTION_COLUMN =
  'mat-table :nth-child(2) > .cdk-column-description';

export const getRecurrentTransactionTab = () =>
  cy.get('[data-cy="recurrent-transactions-tab"]');

export const getAddRecurrentTransactionButton = () =>
  cy.get('[data-cy="add-recurrent-transaction-button"]');

export const getRecurrentAmountInput = () =>
  cy.get('[data-cy="recurrent-tx-amount-input"]');

export const getRecurrentStartDatePicker = () =>
  cy.get('[data-cy="recurrent-tx-start-date-picker"]');

export const getRecurrentDescriptionInput = () =>
  cy.get('[data-cy="recurrent-tx-description-input"]');

export const getCreateRecurrentTransactionButton = () =>
  cy.get('[data-cy="create-recurrent-tx-button"]');

export const getFirstRecurrentAmountCell = () =>
  cy.get('mat-table :nth-child(2) > .justify-end');

export const getDeleteRecurrentTransactionButton = () =>
  cy.get('[data-cy="delete-recurrent-tx-button"]');

export const hasRecurrentTransactionInTable = () =>
  cy
    .get('body expense-tracker-ui-recurrent-transactions')
    .then(($body) => $body.find(FIRST_DESCRIPTION_COLUMN).length !== 0);
