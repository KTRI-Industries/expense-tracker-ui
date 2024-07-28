import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  forkJoin,
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
import { TenantDto } from '@expense-tracker-ui/shared/api';

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

  checkLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkLogin),
      switchMap(() =>
        from([this.keycloak.isLoggedIn()]).pipe(
          filter((isLoggedin) => isLoggedin),
          map(() => AuthActions.loginSuccess()),
        ),
      ),
    ),
  );

  retrieveProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      switchMap(() =>
        forkJoin({
          keycloakUserProfile: from(this.keycloak.loadUserProfile()),
          userRoles: of(this.keycloak.getUserRoles(true)),
        }).pipe(
          map(({ keycloakUserProfile, userRoles }) => {
            return AuthActions.retrieveUserProfileSuccess({
              keycloakUserProfile: {
                ...keycloakUserProfile,
                userRoles,
              },
            });
          }),
          catchError((error) =>
            of(AuthActions.retrieveUserProfileFailure({ error: error })),
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
          email: selectUserProfile?.email ?? '',
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

  refreshRolesAfterTenantGenerated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.generateNewTenantSuccess),
      switchMap(() =>
        from(this.refreshRoles()).pipe(
          map((userRoles) =>
            AuthActions.refreshUserRolesSuccess({ userRoles }),
          ),
          catchError((error) =>
            of(AuthActions.refreshUserRolesFailure({ error: error })),
          ),
        ),
      ),
    ),
  );

  setDefaultTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setDefaultTenant),
      switchMap((action) =>
        this.authService.setDefaultTenant(action.tenantId).pipe(
          map(() => AuthActions.setDefaultTenantSuccess()),
          catchError((error: Error) =>
            of(AuthActions.setDefaultTenantFailure({ error })),
          ),
        ),
      ),
    ),
  );

  /**
   * This is needed because the initial token, before tenant generation, does not have the new tenantId!
   */
  refreshTokenAfterTenantGenerated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.generateNewTenantSuccess),
      switchMap(() =>
        from(this.keycloak.updateToken(-1)).pipe(
          tap((resp) => console.log(`Token refreshed: ${resp}`)),
          map(() => AuthActions.retrieveTenantUsers()),
        ),
      ),
    ),
  );

  retrieveUserTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveTenants),
      switchMap(() =>
        this.authService.retrieveTenants().pipe(
          map((tenants) => AuthActions.retrieveTenantsSuccess({ tenants })),
          catchError((error: Error) =>
            of(AuthActions.retrieveTenantsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  retrieveTenantsAfterUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      map(() => AuthActions.retrieveTenants()),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => of(this.keycloak.logout(window.location.origin))), // redirect to base url after logout
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private keycloak: KeycloakService,
    private authService: AuthService,
    private store: Store,
  ) {}

  /**
   * Without the refreshed token the roles are not updated.
   */
  async refreshRoles(): Promise<string[]> {
    await this.keycloak.updateToken(-1);
    return this.keycloak.getUserRoles(true);
  }
}
