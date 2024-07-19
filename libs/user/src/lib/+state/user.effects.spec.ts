import { fakeAsync, tick } from '@angular/core/testing';
import { createMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { UserActions } from './user.actions';
import { UserService } from '../user.service';
import { UserEffects } from './user.effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { KeycloakService } from 'keycloak-angular';
import { AuthActions } from '@expense-tracker-ui/shared/auth';
import { UserInfo } from '@expense-tracker-ui/api';

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
      leaveTenant: jest.fn(),
      associateTenant: jest.fn(),
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
  }));
  // ...

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

  it('should leave tenant successfully', fakeAsync(() => {
    const tenantId = 'tenant-123';
    const actions$ = of(UserActions.leaveTenant({ tenantId }));

    const userInfo = {} as UserInfo;
    jest.spyOn(userService, 'leaveTenant').mockReturnValue(of(userInfo));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = UserActions.leaveTenantSuccess();

    let result: any;
    userEffects.leaveTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should associate tenant successfully', fakeAsync(() => {
    const tenantId = 'tenant-123';
    const actions$ = of(UserActions.associateTenant({ tenantId }));

    const userInfo = {} as UserInfo;
    jest.spyOn(userService, 'associateTenant').mockReturnValue(of(userInfo));

    const userEffects = new UserEffects(
      actions$,
      userService,
      router,
      snackBar,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = UserActions.associateTenantSuccess();

    let result: any;
    userEffects.associateTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));
});
