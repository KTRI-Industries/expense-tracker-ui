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
  cy.get('[data-cy="recurrent-transaction-amount-cell"]').first();

export const getFirstRecurrentDescriptionCell = () =>
  cy.get('[data-cy="recurrent-transaction-description-cell"]').first();

export const getDeleteRecurrentTransactionButton = () =>
  cy.get('[data-cy="delete-recurrent-tx-button"]');

export const hasRecurrentTransactionInTable = () =>
  cy
    .get('body')
    .then(($body) => $body.find('[data-cy="recurrent-transaction-row"]').length !== 0);
