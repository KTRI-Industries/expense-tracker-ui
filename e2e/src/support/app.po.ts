export {
  TEST_GUEST_EMAIL,
  TEST_GUEST_USERNAME,
  TEST_PASSWORD,
  TEST_USER_EMAIL,
  TEST_USERNAME,
} from './test-config';

export const getGreeting = () => cy.get('[data-cy="main-title"]');

export const getLoginButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=login-button]');

export const getLogoutButton = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=logout-button]');

export const getUsernameLink = () =>
  cy.get('[data-cy="top-menu"]  [data-cy=username-link]');

export const getAccountsTab = () => cy.get('[data-cy="tenants-tab"]');
