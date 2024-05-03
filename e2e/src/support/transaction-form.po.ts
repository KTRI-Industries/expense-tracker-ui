const FIRST_DESCRIPTION_COLUMN =
  'mat-table :nth-child(2) > .cdk-column-description';

export const getAmountInput = () => cy.get('[data-cy="tx-amount-input"]');

export const getDatePicker = () => cy.get('[data-cy="tx-date-picker"]');

export const getDescriptionInput = () =>
  cy.get('[data-cy="tx-description-input"]');

export const getCreateTransactionButton = () =>
  cy.get('[data-cy="create-transaction-button"]');

export const getDeleteTransactionButton = () =>
  cy.get('[data-cy="delete-transaction-button"]');

export const getUpdateTransactionButton = () =>
  cy.get('[data-cy="update-transaction-button"]');
