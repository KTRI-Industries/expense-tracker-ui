export const TEST_USERNAME = 'test_user';
export const TEST_PASSWORD = 'open123';
export const TEST_USER_EMAIL = 'test@test.com';

export const TEST_GUEST_USERNAME = 'test_admin';
export const TEST_GUEST_EMAIL = `${TEST_GUEST_USERNAME}@email.com`;

export const getGreeting = () => cy.get('[data-cy="main-title"]');

export const getLoginButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=login-button]');

export const getLogoutButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=logout-button]');

export const getUsernameLink = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=username-link]');

export const getAccountsTab = () => cy.get('[data-cy="tenants-tab"]');
