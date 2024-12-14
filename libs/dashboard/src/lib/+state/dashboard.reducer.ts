import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import { Category, DashboardDto } from '@expense-tracker-ui/shared/api';
import { ChartData } from 'chart.js';
import { categoryLabels } from '@expense-tracker-ui/transactions';

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export interface DashboardState {
  dashboard: DashboardDto | undefined;
}

export const initialDashboardState: DashboardState = {
  dashboard: undefined,
};

export const dashboardFeature = createFeature({
  name: DASHBOARD_FEATURE_KEY,
  reducer: createReducer(
    initialDashboardState,

    on(DashboardActions.loadDashboardSuccess, (state, { dashboard }) => ({
      ...state,
      dashboard,
    })),
    on(DashboardActions.loadDashboardFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
  extraSelectors: ({ selectDashboard }) => ({
    selectGroupedExpensesChartData: createSelector(
      selectDashboard,
      (dashboard) => {
        return {
          labels:
            dashboard?.expenseByCategory?.labels.map(
              (label) => categoryLabels[label as Category] || label,
            ) || [],
          datasets: [
            {
              data:
                dashboard?.expenseByCategory?.values.map(
                  (value) => value.amount as number,
                ) || [],
            },
          ],
        } as ChartData<'doughnut', number[], string | string[]>;
      },
    ),
    selectIncomeExpensePerMonthChartData: createSelector(
      selectDashboard,
      (dashboard) => {
        return {
          labels: dashboard?.incomeExpensePerMonth?.labels || [],
          datasets: [
            {
              label: 'Income',
              data: dashboard?.incomeExpensePerMonth?.values[0].map(
                (value) => value.amount as number,
              ),
            },
            {
              label: 'Expense',
              data: dashboard?.incomeExpensePerMonth?.values[1].map(
                (value) => value.amount as number,
              ),
            },
          ],
        } as ChartData<'bar', number[], string | string[]>;
      },
    ),
  }),
});
