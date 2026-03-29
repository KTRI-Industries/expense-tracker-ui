export const getAddTransactionButton = () =>
  cy.get('[data-cy="add-transaction-button"]');

export const getFirstAmountCell = () =>
  cy.get('[data-cy="transaction-amount-cell"]').first();

export const getFirstDescriptionCell = () =>
  cy.get('[data-cy="transaction-description-cell"]').first();

export const hasTransactionInTable = () =>
  cy.get('body').then(($body) => $body.find('[data-cy="transaction-row"]').length !== 0);
