import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { DashboardControllerService } from '@expense-tracker-ui/shared/api';
import { DashboardActions } from '../../index';

@Injectable()
export class DashboardEffects {
  private actions$ = inject(Actions);
  private client = inject(DashboardControllerService);

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.initDashboard),
      switchMap(() =>
        this.client
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
        this.client
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

  constructor(private store: Store) {}
}
