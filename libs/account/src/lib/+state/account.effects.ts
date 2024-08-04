import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, from, map, of, switchMap, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountActions } from './account.actions';
import { AccountService } from '../account.service';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AccountEffects {
  retrieveUserAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.retrieveAccounts),
      switchMap(() =>
        this.accountService.retrieveAccounts().pipe(
          map((accounts) =>
            AccountActions.retrieveAccountsSuccess({ accounts }),
          ),
          catchError((error: Error) =>
            of(AccountActions.retrieveAccountsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  setDefaultAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.setDefaultAccount),
      switchMap((action) =>
        this.accountService.setDefaultAccount(action.tenantId).pipe(
          map(() => AccountActions.setDefaultAccountSuccess()),
          catchError((error: Error) =>
            of(AccountActions.setDefaultAccountFailure({ error })),
          ),
        ),
      ),
    ),
  );

  associateUserWithAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.associateUserWithAccount),
      switchMap((action) =>
        this.accountService.associateUserWithAccount(action.tenantId).pipe(
          map(() => AccountActions.associateUserWithAccountSuccess()),
          catchError((error: Error) =>
            of(AccountActions.associateUserWithAccountFailure({ error })),
          ),
        ),
      ),
    ),
  );

  rejectInvite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.rejectInvite),
      switchMap((action) =>
        this.accountService.rejectInvite(action.tenantId).pipe(
          map(() => AccountActions.rejectInviteSuccess()),
          catchError((error: Error) =>
            of(AccountActions.rejectInviteFailure({ error })),
          ),
        ),
      ),
    ),
  );

  leaveAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AccountActions.leaveAccount),
      switchMap((action) =>
        this.accountService.leaveAccount(action.tenantId).pipe(
          map(() => AccountActions.leaveAccountSuccess()),
          catchError((error: Error) =>
            of(AccountActions.leaveAccountFailure({ error })),
          ),
        ),
      ),
    ),
  );

  retrieveAccountsAfterAccountChangeAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AccountActions.associateUserWithAccountSuccess,
        AccountActions.rejectInviteSuccess,
        AccountActions.leaveAccountSuccess,
        AccountActions.setDefaultAccountSuccess,
        AuthActions.generateNewTenantSuccess,
      ),
      map(() => AccountActions.retrieveAccounts()),
    ),
  );

  // TODO this is not a great effect since it does two things, refreshes the keycloak token and retrieves the users
  refreshTokenAndRetrieveUsersForAccountAssociatedOrLeft$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AccountActions.associateUserWithAccountSuccess,
        AccountActions.leaveAccountSuccess,
      ),
      switchMap(() =>
        from(this.keycloak.updateToken(-1)).pipe(
          tap((resp) => console.log(`Token refreshed: ${resp}`)),
          map(() => AuthActions.retrieveTenantUsers()),
        ),
      ),
    ),
  );

  /**
   * This effect is needed on initial load because we need to retrieve invitations to accounts and current account which are displayed in the nav menu.
   */
  retrieveTenantsAfterUserProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.retrieveUserProfileSuccess),
      map(() => AccountActions.retrieveAccounts()),
    ),
  );

  constructor(
    private actions$: Actions,
    private accountService: AccountService,
    private store: Store,
    private keycloak: KeycloakService,
  ) {}
}
