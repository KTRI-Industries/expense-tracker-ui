import { fakeAsync, tick } from '@angular/core/testing';
import { createMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { UserActions } from './user.actions';
import { UserService } from '../user.service';
import { UserEffects } from './user.effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('UserEffects', () => {
  let router: Router;
  let snackBar: MatSnackBar;

  let userService: UserService;

  beforeEach(() => {
    userService = { inviteUser: jest.fn(), unInviteUser: jest.fn() } as any;

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
    );

    const expectedAction = UserActions.unInviteUserSuccess();

    let result: any;
    userEffects.unInviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));
});
