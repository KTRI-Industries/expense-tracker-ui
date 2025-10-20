import { Injectable, inject } from '@angular/core';
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
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private userService = inject(UserService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private store = inject(Store);
  private keycloak = inject(KeycloakService);

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
      withLatestFrom(this.store.select(AuthSelectors.selectUserProfile)),
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

  clearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.inviteUserSuccess),
      map(() => ErrorHandlingActions.clearBackEndError()),
    ),
  );
}
