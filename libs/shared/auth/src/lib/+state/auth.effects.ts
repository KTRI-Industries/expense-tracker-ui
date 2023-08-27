import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);

  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(() => of(this.keycloak.login()))
      ),
    { dispatch: false }
  );

  retrieveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap((_) =>
        from(this.keycloak.loadUserProfile()).pipe(
          map((userProfile) =>
            AuthActions.retrieveUserProfileSuccess({ userProfile })
          ),
          catchError((error) =>
            of(AuthActions.retrieveUserProfileFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(private keycloak: KeycloakService) {}
}