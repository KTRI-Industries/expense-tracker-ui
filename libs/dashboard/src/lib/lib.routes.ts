import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromDashboard from './+state/dashboard.reducer';
import { DashboardEffects } from './+state/dashboard.effects';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    providers: [
      provideState(
        fromDashboard.DASHBOARD_FEATURE_KEY,
        fromDashboard.dashboardReducer,
      ),
      provideEffects(DashboardEffects),
    ],
  },
];
