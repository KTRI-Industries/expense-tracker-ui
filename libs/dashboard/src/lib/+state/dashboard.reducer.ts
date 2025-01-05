import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import { Category, DashboardDto } from '@expense-tracker-ui/shared/api';
import { ChartData } from 'chart.js';
import { categoryLabels } from '@expense-tracker-ui/transactions';
import moment, { Moment } from 'moment';

export const DASHBOARD_FEATURE_KEY = 'dashboard';

export interface FilterRange {
  startDate?: Moment;
  endDate?: Moment;
  dateRange?: string;
}
export interface DashboardState {
  dashboard: DashboardDto | undefined;
  filterRange: FilterRange | undefined;
}

export const initialDashboardState: DashboardState = {
  dashboard: undefined,
  filterRange: {
    startDate: moment().subtract(1, 'year'),
    endDate: moment(),
    dateRange: 'lastYear',
  },
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
    on(DashboardActions.dateRangeChange, (state, { filterRange }) => ({
      ...state,
      filterRange,
    })),
  ),
  extraSelectors: ({ selectDashboard, selectFilterRange }) => ({
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
    selectExpensesPerUserChartData: createSelector(
      selectDashboard,
      (dashboard) => {
        if (!dashboard) return null;

        const datasets = Object.keys(
          dashboard.incomeExpensePerMonthPerIndividual,
        ).map((user) => {
          return {
            label: user,
            data: dashboard.incomeExpensePerMonthPerIndividual[
              user
            ].values[1].map((value) => value.amount as number),
            fill: false,
            // borderColor: getRandomColor(), // Function to generate random colors for each user
          };
        });

        return {
          labels: dashboard.incomeExpensePerMonth.labels,
          datasets: datasets,
        } as ChartData<'line', number[], string | string[]>;
      },
    ),
  }),
});
