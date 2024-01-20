import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';
import * as HomepageActions from './homepage.actions';

@Injectable()
export class HomepageEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(HomepageActions.initHomepage),
      switchMap(() =>
        of(HomepageActions.loadHomepageSuccess({ homepage: [] })),
      ),
      catchError((error) => {
        console.error('Error', error);
        return of(HomepageActions.loadHomepageFailure({ error }));
      }),
    ),
  );
}
