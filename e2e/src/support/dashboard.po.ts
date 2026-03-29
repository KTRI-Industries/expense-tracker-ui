export const getDashboardIncomeCard = () =>
  cy.get('[data-cy="dashboard-income-card"]');

export const getDashboardExpensesCard = () =>
  cy.get('[data-cy="dashboard-expenses-card"]');

export const getDashboardBalanceCard = () =>
  cy.get('[data-cy="dashboard-balance-card"]');

export const getDashboardTransactionsCard = () =>
  cy.get('[data-cy="dashboard-transactions-card"]');

export const getDashboardDateRangeSelect = () =>
  cy.get('[data-cy="dashboard-date-range-select"]');

export const getDashboardStartDateInput = () =>
  cy.get('[data-cy="dashboard-start-date-input"]');

export const getDashboardEndDateInput = () =>
  cy.get('[data-cy="dashboard-end-date-input"]');

export const getDashboardApplyButton = () =>
  cy.get('[data-cy="dashboard-apply-filter-button"]');

export const getDashboardCategoryChartSection = () =>
  cy.get('[data-cy="dashboard-category-chart"]');

export const getDashboardMonthlyChartSection = () =>
  cy.get('[data-cy="dashboard-monthly-chart"]');

export const getDashboardPerUserChartSection = () =>
  cy.get('[data-cy="dashboard-per-user-chart"]');
