export const getAmountInput = () => cy.get('[data-cy="tx-amount-input"]');

export const getDatePicker = () => cy.get('[data-cy="tx-date-picker"]');

export const getDescriptionInput = () =>
  cy.get('[data-cy="tx-description-input"]');

export const getCreateTransactionButton = () =>
  cy.get('[data-cy="create-transaction-button"]');
