export const getTransactionMenu = () =>
  cy.get('[data-cy="top-menu"] >[data-cy="transactions-menu"]');

export const getAddTransactionButton = () =>
  cy.get('[data-cy="add-transaction-button"]');
