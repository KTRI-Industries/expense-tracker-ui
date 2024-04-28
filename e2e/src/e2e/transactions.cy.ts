import {
  getAddTransactionButton,
  getTransactionMenu,
} from '../support/navigation-menu.po';

const TEST_USERNAME = 'test_user';
const TEST_PASSWORD = 'open123';

describe('transactions', () => {
  beforeEach(() => cy.visit('/'));

  it('should display transactions page', () => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);

    getTransactionMenu().click();

    getAddTransactionButton().should('be.visible');
  });
});
