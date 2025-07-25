import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { FilterRange } from './dashboard.reducer';

export const DashboardActions = createActionGroup({
  source: 'Dashboard',
  events: {
    'Init Dashboard': emptyProps(),
    'Load Dashboard Success': props<{ dashboard: DashboardDto }>(),
    'Load Dashboard Failure': props<{ error: any }>(),
    'Date Range Change': props<{ filterRange: FilterRange }>()
  }
});
