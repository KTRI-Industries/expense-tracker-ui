import { getGreeting, getLogoutButton } from '../support/app.po';

const TEST_USERNAME = 'test_user';
const TEST_PASSWORD = 'open123';

describe('expense-tracker-ui', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    // Function helper example, see `../support/app.po.ts` file
    getGreeting().contains('Expense Tracker');
  });

  it('should login', () => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);

    getLogoutButton().should('be.visible');
  });
});
