const FIRST_DESCRIPTION_COLUMN =
  'mat-table :nth-child(2) > .cdk-column-description';

export const getAddTransactionButton = () =>
  cy.get('[data-cy="add-transaction-button"]');

export const getFirstAmountCell = () =>
  cy.get('mat-table :nth-child(2) > .justify-end');

export const getFirstDescriptionCell = () => cy.get(FIRST_DESCRIPTION_COLUMN);

export const hasTransactionInTable = () =>
  cy
    .get('body')
    .then(($body) => $body.find(FIRST_DESCRIPTION_COLUMN).length !== 0);
