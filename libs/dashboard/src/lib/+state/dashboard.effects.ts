import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardService } from '../dashboard.service';

@Injectable()
export class DashboardEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private dashboardService: DashboardService,
  ) {}

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.initDashboard),
      switchMap(() =>
        this.dashboardService
          .getDashboard()
          .pipe(
            map((dashboard) =>
              DashboardActions.loadDashboardSuccess({ dashboard }),
            ),
          ),
      ),
    ),
  );

  filterDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.dateRangeChange),
      switchMap(({ filterRange }) =>
        this.dashboardService
          .getDashboard(
            filterRange.startDate?.format('YYYY-MM-DDTHH:mm:ss'),
            filterRange.endDate?.format('YYYY-MM-DDTHH:mm:ss'),
          )
          .pipe(
            map((dashboard) =>
              DashboardActions.loadDashboardSuccess({ dashboard }),
            ),
          ),
      ),
    ),
  );
}
