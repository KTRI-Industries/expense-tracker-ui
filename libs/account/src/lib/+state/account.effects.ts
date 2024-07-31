import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';
import * as AccountActions from './account.actions';

@Injectable()
export class AccountEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.initAccount),
      switchMap(() => of(AccountActions.loadAccountSuccess({ account: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(AccountActions.loadAccountFailure({ error }));
      }),
    ),
  );
}
