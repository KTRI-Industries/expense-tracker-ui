import { inject, Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

@Injectable()
export class HomepageEffects {
  private actions$ = inject(Actions);

  /*  init$ = createEffect(() =>
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
  );*/
}
