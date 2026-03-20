import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  EMPTY,
  exhaustMap,
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
import { FeatureFlagActions } from '@expense-tracker-ui/shared/feature-flags';
import { PasskeyService } from '../passkey.service';
import { MatDialog } from '@angular/material/dialog';
import {
  PasskeyPromptDialogComponent,
  PasskeyPromptResult,
} from '../passkey-prompt-dialog/passkey-prompt-dialog.component';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private keycloak: KeycloakService,
    private authService: AuthService,
    private store: Store,
    private passkeyService: PasskeyService,
    private dialog: MatDialog,
  ) {}

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

  loadFeatureFlagsAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      map(() => FeatureFlagActions.loadFeatureFlags()),
    ),
  );

  generateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.generateNewTenant),
      exhaustMap((action) =>
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

  checkPasskeyStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      filter(() => this.passkeyService.shouldShowPasskeyPrompt()),
      switchMap(() =>
        this.passkeyService.hasPasskey().pipe(
          filter((hasPasskey) => !hasPasskey),
          map(() => AuthActions.showPasskeyPrompt()),
          catchError(() => EMPTY),
        ),
      ),
    ),
  );

  showPasskeyPrompt$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.showPasskeyPrompt),
      exhaustMap(() => {
        const dialogRef = this.dialog.open<
          PasskeyPromptDialogComponent,
          void,
          PasskeyPromptResult
        >(PasskeyPromptDialogComponent);

        return dialogRef.afterClosed().pipe(
          map((choice) =>
            AuthActions.passkeyPromptCompleted({ choice: choice ?? 'later' }),
          ),
        );
      }),
    ),
  );

  openPasskeySecurityPage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.passkeyPromptCompleted),
        filter(({ choice }) => choice === 'setup'),
        tap(() => this.passkeyService.openSecurityPage()),
      ),
    { dispatch: false },
  );

  persistPasskeyPromptDismissal$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.passkeyPromptCompleted),
        filter(({ choice }) => choice === 'never'),
        tap(() => this.passkeyService.dismissPasskeyPrompt()),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => of(this.keycloak.logout(window.location.origin))),
      ),
    { dispatch: false },
  );

  async refreshRoles(): Promise<string[]> {
    await this.keycloak.updateToken(-1);
    return this.keycloak.getUserRoles(true);
  }
}
