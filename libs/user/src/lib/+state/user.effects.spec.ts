import { fakeAsync, tick } from '@angular/core/testing';
import { createMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

import { UserActions } from './user.actions';
import { UserService } from '../user.service';
import { UserEffects } from './user.effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';

describe('UserEffects', () => {
  let router: Router;
  let snackBar: MatSnackBar;

  let userService: UserService;
  let keycloakService: KeycloakService;

  beforeEach(() => {
    keycloakService = {
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: jest.fn(),
      loadUserProfile: jest.fn(),
      getUserRoles: jest.fn(),
      // add other methods as needed
    } as any;
    userService = {
      inviteUser: jest.fn(),
      unInviteUser: jest.fn(),
      retrieveTenantUsers: jest.fn(),
    } as any;

    router = { navigate: jest.fn() } as any;
    snackBar = { open: jest.fn() } as any;
  });

  it('should invite user successfully', fakeAsync(() => {
    const recipientEmail = 'john@example.com';
    const actions$ = of(UserActions.inviteUser({ recipientEmail }));

    jest.spyOn(userService, 'inviteUser').mockReturnValue(
      of({
        email: recipientEmail,
      }),
    );

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = UserActions.inviteUserSuccess({
      invitedUser: {
        email: recipientEmail,
      },
    });

    let result: any;
    userEffects.inviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
    expect(router.navigate).toHaveBeenCalledWith(['user-page']);
    expect(snackBar.open).toHaveBeenCalledWith('User invited', 'Close');
  }));

  it('should uninvite user successfully', fakeAsync(() => {
    const userEmail = 'john@example.com';
    const actions$ = of(UserActions.unInviteUser({ userEmail }));

    jest.spyOn(userService, 'unInviteUser').mockReturnValue(
      of({
        email: userEmail,
        isMainUser: false,
      }),
    );

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = UserActions.unInviteUserSuccess();

    let result: any;
    userEffects.unInviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
    expect(snackBar.open).toHaveBeenCalledWith('User un-invited', 'Close');
  }));

  it('should dispatch inviteUserFailure when inviting a user fails', fakeAsync(() => {
    const recipientEmail = 'john@example.com';
    const error = new Error('invite failed');
    const actions$ = of(UserActions.inviteUser({ recipientEmail }));

    jest
      .spyOn(userService, 'inviteUser')
      .mockReturnValue(throwError(() => error));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    userEffects.inviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(UserActions.inviteUserFailure({ error }));
    expect(router.navigate).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  }));

  it('should dispatch unInviteUserFailure when uninviting a user fails', fakeAsync(() => {
    const userEmail = 'john@example.com';
    const error = new Error('uninvite failed');
    const actions$ = of(UserActions.unInviteUser({ userEmail }));

    jest
      .spyOn(userService, 'unInviteUser')
      .mockReturnValue(throwError(() => error));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    userEffects.unInviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(UserActions.unInviteUserFailure({ error }));
    expect(snackBar.open).not.toHaveBeenCalled();
  }));

  it('should retrieve tenant users successfully', fakeAsync(() => {
    const actions$ = of(AuthActions.retrieveTenantUsers());

    const users = [
      {
        userId: '1',
        username: 'user1',
        email: 'user1@example.com',
        isMainUser: false,
      },
      {
        userId: '2',
        username: 'user2',
        email: 'user2@example.com',
        isMainUser: false,
      },
    ];

    jest.spyOn(userService, 'retrieveTenantUsers').mockReturnValue(of(users));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({
        initialState: {
          auth: {
            userProfile: {
              tenantId: 'tenant-123',
              // other properties...
            },
            // other state properties...
          },
        },
      }),
      keycloakService,
    );

    const expectedAction = AuthActions.retrieveTenantUsersSuccess({ users });

    let result: any;
    userEffects.retrieveTenantUsers$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch retrieveTenantUsersFailure when retrieving tenant users fails', fakeAsync(() => {
    const actions$ = of(AuthActions.retrieveTenantUsers());
    const error = new Error('retrieve tenant users failed');

    jest
      .spyOn(userService, 'retrieveTenantUsers')
      .mockReturnValue(throwError(() => error));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({
        initialState: {
          auth: {
            userProfile: {
              tenantId: 'tenant-123',
            },
          },
        },
      }),
      keycloakService,
    );

    let result: any;
    userEffects.retrieveTenantUsers$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(AuthActions.retrieveTenantUsersFailure({ error }));
  }));

  it('should not retrieve tenant users when there is no tenant id', fakeAsync(() => {
    const actions$ = of(AuthActions.retrieveTenantUsers());

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({
        initialState: {
          auth: {
            userProfile: {
              tenantId: undefined,
            },
          },
        },
      }),
      keycloakService,
    );

    let result: any;
    userEffects.retrieveTenantUsers$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toBeUndefined();
    expect(userService.retrieveTenantUsers).not.toHaveBeenCalled();
  }));

  it('should clear backend errors after inviting a user successfully', fakeAsync(() => {
    const actions$ = of(
      UserActions.inviteUserSuccess({
        invitedUser: {
          email: 'john@example.com',
        },
      }),
    );

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    userEffects.clearError$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(ErrorHandlingActions.clearBackEndError());
  }));
});
