import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';
import { UserActions } from './user.actions';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { selectUserProfile } from '../../../../shared/auth/src/lib/+state/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class UserEffects {
  inviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.inviteUser),
      switchMap((action) =>
        this.userService.inviteUser(action.recipientEmail).pipe(
          map((invitedUser) => UserActions.inviteUserSuccess({ invitedUser })),
          tap(() => this.router.navigate(['user-page'])),
          tap(() => this.snackBar.open('User invited', 'Close')),
          catchError((error: Error) =>
            of(UserActions.inviteUserFailure({ error })),
          ),
        ),
      ),
    ),
  );

  unInviteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.unInviteUser),
      switchMap((action) =>
        this.userService.unInviteUser(action.userEmail).pipe(
          map(() => UserActions.unInviteUserSuccess()),
          tap(() => this.snackBar.open('User un-invited', 'Close')),
          catchError((error: Error) =>
            of(UserActions.unInviteUserFailure({ error })),
          ),
        ),
      ),
    ),
  );

  retrieveTenantUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AuthActions.retrieveTenantUsers, // TODO rethink this action being in auth slice
        UserActions.inviteUserSuccess,
        UserActions.unInviteUserSuccess,
      ),
      withLatestFrom(this.store.select(selectUserProfile)),
      filter(([_, selectUserProfile]) => selectUserProfile?.tenantId != null),
      switchMap(() =>
        this.userService.retrieveTenantUsers().pipe(
          map((users) => AuthActions.retrieveTenantUsersSuccess({ users })),
          catchError((error: Error) =>
            of(AuthActions.retrieveTenantUsersFailure({ error })),
          ),
        ),
      ),
    ),
  );

  retrieveTenantsAfterTenantChangeAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        UserActions.associateTenantSuccess,
        AuthActions.retrieveUserProfileSuccess,
        UserActions.leaveTenantSuccess,
        AuthActions.setDefaultTenantSuccess,
        AuthActions.generateNewTenantSuccess,
      ),
      map(() => UserActions.retrieveTenants()),
    ),
  );

  retrieveUserTenants$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.retrieveTenants),
      switchMap(() =>
        this.userService.retrieveTenants().pipe(
          map((tenants) => UserActions.retrieveTenantsSuccess({ tenants })),
          catchError((error: Error) =>
            of(UserActions.retrieveTenantsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  leaveTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.leaveTenant),
      switchMap((action) =>
        this.userService.leaveTenant(action.tenantId).pipe(
          map(() => UserActions.leaveTenantSuccess()),
          catchError((error: Error) =>
            of(UserActions.leaveTenantFailure({ error })),
          ),
        ),
      ),
    ),
  );

  associateTenant$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.associateTenant),
      switchMap((action) =>
        this.userService.associateTenant(action.tenantId).pipe(
          map(() => UserActions.associateTenantSuccess()),
          catchError((error: Error) =>
            of(UserActions.associateTenantFailure({ error })),
          ),
        ),
      ),
    ),
  );

  clearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.inviteUserSuccess),
      map(() => ErrorHandlingActions.clearBackEndError()),
    ),
  );

  constructor(
    private actions$: Actions,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store,
  ) {}
}
