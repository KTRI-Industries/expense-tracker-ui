import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, filter, from, map, of, switchMap, tap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(() => of(this.keycloak.login()))
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => of(this.keycloak.logout(window.location.origin))) // redirect to base url after logout
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

  checkLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      switchMap((_) =>
        from(this.keycloak.isLoggedIn()).pipe(
          filter((isLoggedin) => isLoggedin),
          map((_) => AuthActions.loginSuccess()),
          catchError((error) =>
            of(AuthActions.checkLoginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(private actions$: Actions, private keycloak: KeycloakService) {}
}
