import { TEST_PASSWORD, TEST_USERNAME } from '../support/app.po';
import moment from 'moment';
import {
  getDashboardApplyButton,
  getDashboardBalanceCard,
  getDashboardCategoryChartSection,
  getDashboardDateRangeSelect,
  getDashboardEndDateInput,
  getDashboardExpensesCard,
  getDashboardIncomeCard,
  getDashboardMonthlyChartSection,
  getDashboardPerUserChartSection,
  getDashboardStartDateInput,
  getDashboardTransactionsCard,
} from '../support/dashboard.po';

function readNumericValue(selector: Cypress.Chainable<JQuery<HTMLElement>>) {
  return selector.invoke('text').then((text) => {
    const numericText = text.replace(/[^\d,-]/g, '').replace(',', '.');
    return Number.parseFloat(numericText);
  });
}

function formatGreekDate(date: moment.Moment) {
  return date.format('DD/MM/YYYY');
}

describe('dashboard', () => {
  before(() => {
    cy.then(Cypress.session.clearCurrentSessionData);
  });

  beforeEach(() => {
    cy.login(TEST_USERNAME, TEST_PASSWORD);
    cy.deleteVisibleTransactions();
  });

  it('should render dashboard summaries and chart sections for seeded transactions', () => {
    const incomeDate = moment().subtract(7, 'days');
    const expenseDateA = moment().subtract(6, 'days');
    const expenseDateB = moment().subtract(5, 'days');

    cy.seedTransactions([
      {
        amount: 120,
        date: formatGreekDate(incomeDate),
        description: 'Dashboard seeded income',
      },
      {
        amount: -40,
        date: formatGreekDate(expenseDateA),
        description: 'Dashboard seeded expense A',
      },
      {
        amount: -10,
        date: formatGreekDate(expenseDateB),
        description: 'Dashboard seeded expense B',
      },
    ]);

    cy.intercept('GET', '**/dashboard*').as('getDashboard');

    cy.visit('/');

    cy.wait('@getDashboard')
      .its('response.statusCode')
      .should('eq', 200);

    readNumericValue(getDashboardIncomeCard()).should('eq', 120);
    readNumericValue(getDashboardExpensesCard()).should('eq', -50);
    readNumericValue(getDashboardBalanceCard()).should('eq', 70);
    getDashboardTransactionsCard().should('contain.text', '3');

    // scrollIntoView is required because mat-sidenav-content is the scroll container
    // (overflow:auto) — elements below the fold are clipped and Cypress considers
    // them not visible until explicitly scrolled into the viewport.
    getDashboardCategoryChartSection().scrollIntoView().should('be.visible');
    getDashboardMonthlyChartSection().scrollIntoView().should('be.visible');
    getDashboardPerUserChartSection().scrollIntoView().should('be.visible');
  });

  it('should apply a custom dashboard date range and refresh totals', () => {
    const currentMonthStart = moment().startOf('month').add(1, 'day');
    const inRangeIncomeDate = currentMonthStart.clone();
    const inRangeExpenseDate = currentMonthStart.clone().add(1, 'day');
    const outOfRangeDate = currentMonthStart.clone().subtract(1, 'month');
    const rangeStart = currentMonthStart.clone().startOf('month');
    const rangeEnd = currentMonthStart.clone().endOf('month');

    cy.seedTransactions([
      {
        amount: 100,
        date: formatGreekDate(inRangeIncomeDate),
        description: 'Dashboard in-range income',
      },
      {
        amount: -40,
        date: formatGreekDate(inRangeExpenseDate),
        description: 'Dashboard in-range expense',
      },
      {
        amount: -25,
        date: formatGreekDate(outOfRangeDate),
        description: 'Dashboard out-of-range expense',
      },
    ]);

    cy.intercept('GET', '**/dashboard*').as('getDashboard');

    cy.visit('/');

    cy.wait('@getDashboard');

    getDashboardDateRangeSelect().click();
    cy.contains('mat-option', 'Custom Date Range').click();

    getDashboardStartDateInput()
      .clear({ force: true })
      .type(formatGreekDate(rangeStart), { force: true });
    getDashboardEndDateInput()
      .clear({ force: true })
      .type(formatGreekDate(rangeEnd), { force: true });
    getDashboardApplyButton().click();

    cy.wait('@getDashboard').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);
      expect(interception.request.url).to.include(
        rangeStart.format('YYYY-MM-DD'),
      );
      expect(interception.request.url).to.include(rangeEnd.format('YYYY-MM-DD'));
    });

    readNumericValue(getDashboardIncomeCard()).should('eq', 100);
    readNumericValue(getDashboardExpensesCard()).should('eq', -40);
    readNumericValue(getDashboardBalanceCard()).should('eq', 60);
    getDashboardTransactionsCard().should('contain.text', '2');
  });
});
