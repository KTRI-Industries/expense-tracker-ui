import { createFeature, createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import { DashboardDto } from '@expense-tracker-ui/shared/api';

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
  /*  extraSelectors: ({selectDashboard}) => ({

  })*/
});
