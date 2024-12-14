import { DashboardState, initialDashboardState } from './dashboard.reducer';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { ChartData } from 'chart.js';
import * as DashboardSelectors from './dashboard.selectors';

describe('Dashboard Reducer', () => {
  describe('selectChartData', () => {
    it('returns empty chart data when dashboard is undefined', () => {
      const state: DashboardState = {
        ...initialDashboardState,
        dashboard: undefined,
      };
      const result =
        DashboardSelectors.selectGroupedExpensesChartData.projector(
          state.dashboard,
        );
      expect(result).toEqual({
        labels: [],
        datasets: [{ data: [] }],
      } as ChartData<'doughnut', number[], string | string[]>);
    });

    it('returns chart data when dashboard is defined', () => {
      const dashboard: DashboardDto = {
        expenseByCategory: {
          labels: ['Food', 'Transport'],
          values: [{ amount: 100 }, { amount: 50 }],
        },
      } as DashboardDto;
      const state: DashboardState = { ...initialDashboardState, dashboard };
      const result =
        DashboardSelectors.selectGroupedExpensesChartData.projector(
          state.dashboard,
        );
      expect(result).toEqual({
        labels: ['Food', 'Transport'],
        datasets: [{ data: [100, 50] }],
      } as ChartData<'doughnut', number[], string | string[]>);
    });

    it('returns empty chart data when expenseByCategory is undefined', () => {
      const dashboard: DashboardDto = {} as DashboardDto;
      const state: DashboardState = { ...initialDashboardState, dashboard };
      const result =
        DashboardSelectors.selectGroupedExpensesChartData.projector(
          state.dashboard,
        );
      expect(result).toEqual({
        labels: [],
        datasets: [{ data: [] }],
      } as ChartData<'doughnut', number[], string | string[]>);
    });
  });
});
