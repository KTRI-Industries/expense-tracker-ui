import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, of, switchMap } from 'rxjs';
import * as UserActions from './user.actions';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.initUser),
      switchMap(() => of(UserActions.loadUserSuccess({ user: [] }))),
      catchError((error) => {
        console.error('Error', error);
        return of(UserActions.loadUserFailure({ error }));
      }),
    ),
  );
}
