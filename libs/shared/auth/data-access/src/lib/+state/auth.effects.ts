import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from './auth.actions';
import { HttpClient } from '@angular/common/http';

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

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => of(this.keycloak.logout()))
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

  retrieveAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      switchMap((_) =>
        this.client.get<string>('http://localhost:8080/admin').pipe(
          map((message: string) => AuthActions.adminCallSuccess({ message })),
          catchError((error: Error) =>
            of(AuthActions.adminCallError({ error }))
          )
        )
      )
    )
  );

  constructor(private keycloak: KeycloakService, private client: HttpClient) {}
}
