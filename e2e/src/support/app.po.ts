export const getGreeting = () => cy.get('[data-cy="main-title"]');

export const getLoginButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=login-button]');

export const getLogoutButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=logout-button]');
