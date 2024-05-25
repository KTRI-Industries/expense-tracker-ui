const FIRST_USER_COLUMN = 'mat-selection-list :nth-child(1)';

export const getUserInviteLink = () => cy.get('[data-cy="invite-link"]');

export const getUserEmailInput = () => cy.get('[data-cy="user-email-input"]');

export const getInviteButton = () => cy.get('[data-cy="invite-user-button"]');

export const getUserList = () => cy.get('[data-cy="user-list"]');

export const hasUserExceptSelfInTable = () =>
  cy.get('body').then(($body) => $body.find(FIRST_USER_COLUMN).length !== 0);

export const getUserEMailListElement = () => cy.get(FIRST_USER_COLUMN);

export const getUnInviteUserButton = () =>
  cy.get('[data-cy="delete-user-button"]');
