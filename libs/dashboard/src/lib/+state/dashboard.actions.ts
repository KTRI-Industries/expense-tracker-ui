import { createAction, props } from '@ngrx/store';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { FilterRange } from './dashboard.reducer';

export const initDashboard = createAction('[Dashboard Page] Init');

export const loadDashboardSuccess = createAction(
  '[Dashboard/API] Load Dashboard Success',
  props<{ dashboard: DashboardDto }>(),
);

export const loadDashboardFailure = createAction(
  '[Dashboard/API] Load Dashboard Failure',
  props<{ error: any }>(),
);

export const dateRangeChange = createAction(
  '[Dashboard Page] Date Range Change',
  props<{ filterRange: FilterRange }>(),
);
