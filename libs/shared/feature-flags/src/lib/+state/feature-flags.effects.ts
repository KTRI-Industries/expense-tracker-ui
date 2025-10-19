import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { FeatureFlagActions } from './feature-flags.actions';
import { FeatureFlagsControllerService } from '@expense-tracker-ui/shared/api';

@Injectable()
export class FeatureFlagsEffects {
  private actions$ = inject(Actions);
  private featureFlagsController = inject(FeatureFlagsControllerService);

  loadFeatureFlags$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FeatureFlagActions.loadFeatureFlags),
      switchMap(() =>
        this.featureFlagsController.getFlags().pipe(
          map((flags) => FeatureFlagActions.loadFeatureFlagsSuccess({ flags })),
          catchError((error) => {
            return of(FeatureFlagActions.loadFeatureFlagsFailure({ error }));
          }),
        ),
      ),
    ),
  );
}
