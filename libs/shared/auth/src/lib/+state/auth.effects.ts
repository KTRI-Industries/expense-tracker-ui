import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  from,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from './auth.actions';
import { Store } from '@ngrx/store';
import { selectUserProfile } from './auth.selectors';
import { AuthService } from '../auth.service';
import { TenantDto } from '@expense-tracker-ui/api';

@Injectable()
export class AuthEffects {
  login$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.login),
        tap(() => of(this.keycloak.login())),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => of(this.keycloak.logout(window.location.origin))), // redirect to base url after logout
      ),
    { dispatch: false },
  );

  retrieveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() =>
        from(this.keycloak.loadUserProfile()).pipe(
          map((keycloakUserProfile) =>
            AuthActions.retrieveUserProfileSuccess({ keycloakUserProfile }),
          ),
          catchError((error) =>
            of(
              AuthActions.retrieveUserProfileFailure({ error: error.message }),
            ),
          ),
        ),
      ),
    ),
  );

  checkLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      switchMap(() =>
        from([this.keycloak.isLoggedIn()]).pipe(
          filter((isLoggedin) => isLoggedin),
          map(() => AuthActions.loginSuccess()),
          catchError((error) =>
            of(AuthActions.checkLoginFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  checkTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      withLatestFrom(this.store.select(selectUserProfile)),
      filter(([_, selectUserProfile]) => selectUserProfile?.tenantId == null),
      map(([_, selectUserProfile]) =>
        AuthActions.generateNewTenant({
          email: selectUserProfile?.email || '',
        }),
      ),
    ),
  );

  generateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.generateNewTenant),
      switchMap((action) =>
        this.authService.generateTenant(action.email).pipe(
          map((tenant: TenantDto) =>
            AuthActions.generateNewTenantSuccess({ tenantId: tenant.id }),
          ),
          catchError((error: Error) =>
            of(AuthActions.generateNewTenantFailure({ error })),
          ),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private keycloak: KeycloakService,
    private authService: AuthService,
    private store: Store,
  ) {}
}
