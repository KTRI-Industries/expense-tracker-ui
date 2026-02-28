import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { combineLatest, filter, map, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { DashboardActions } from './dashboard.actions';
import { DashboardService } from '../dashboard.service';
import { AccountSelectors } from '@expense-tracker-ui/account';

@Injectable()
export class DashboardEffects {
  constructor(
    private store: Store,
    private actions$: Actions,
    private dashboardService: DashboardService,
  ) {}

  /**
   * Load dashboard when dashboard page is initialized and when current account is set
   * The combineLatest ensures that dashboard is not loaded if tenant is not yet generated (first login of new user).
   * And that dashboard is loaded when tenant becames available (so the effect must fire when currentAccount changes.
   */
  loadDashboard$ = createEffect(() =>
    combineLatest([
      this.actions$.pipe(ofType(DashboardActions.initDashboard)),
      this.store.select(AccountSelectors.selectCurrentAccount),
    ]).pipe(
      filter(([_, currentAccount]) => !!currentAccount),
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
