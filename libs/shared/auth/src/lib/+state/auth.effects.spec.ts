import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';
import { of, throwError } from 'rxjs';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../auth.service';
import { createMockStore } from '@ngrx/store/testing';
import { TenantDto } from '@expense-tracker-ui/api';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('AuthEffects', () => {
  let keycloakService: KeycloakService;
  let authService: AuthService;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    keycloakService = {
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: jest.fn(),
      loadUserProfile: jest.fn(),
      // add other methods as needed
    } as any;
    authService = {
      generateTenant: jest.fn(),
      inviteUser: jest.fn(),
      uninviteUser: jest.fn(),
    } as any;
    snackBar = { open: jest.fn() } as any;
  });

  it('should log in user when login action is triggered', fakeAsync(() => {
    const actions$ = of(AuthActions.login());

    jest.spyOn(keycloakService, 'login');

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    authEffects.login$.subscribe();

    tick();

    expect(keycloakService.login).toHaveBeenCalled();
  }));

  it('should log out user and redirect to base url when logout action is triggered', fakeAsync(() => {
    const actions$ = of(AuthActions.logout());

    jest.spyOn(keycloakService, 'logout');

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    authEffects.logout$.subscribe();

    tick();

    expect(keycloakService.logout).toHaveBeenCalledWith(window.location.origin);
  }));

  it('should retrieve user profile after successful login', fakeAsync(() => {
    const userProfile: KeycloakProfile = {
      id: '123',
      username: 'john_doe',
      email: 'john@example.com',
    };
    const actions$ = of(AuthActions.loginSuccess());

    jest
      .spyOn(keycloakService, 'loadUserProfile')
      .mockImplementation(() => Promise.resolve(userProfile));

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.retrieveUserProfileSuccess({
      keycloakUserProfile: userProfile,
    });

    let result: any;
    authEffects.retrieveProfile$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should check if user is logged in and dispatch loginSuccess action if true', fakeAsync(() => {
    const actions$ = of(AuthActions.checkLogin());

    jest.spyOn(keycloakService, 'isLoggedIn').mockImplementation(() => true);

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.loginSuccess();

    let result: any;
    authEffects.checkLogin$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch retrieveUserProfileFailure action if profile retrieval fails', fakeAsync(() => {
    const error = new Error('Profile retrieval failed');
    const actions$ = of(AuthActions.loginSuccess());

    jest
      .spyOn(keycloakService, 'loadUserProfile')
      .mockImplementation(() => Promise.reject(error));

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );
    const expectedAction = AuthActions.retrieveUserProfileFailure({
      error,
    });

    let result: any;
    authEffects.retrieveProfile$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should generate tenant successfully', fakeAsync(() => {
    const tenant: TenantDto = { id: '123' };
    const email = 'john@example.com';
    const actions$ = of(AuthActions.generateNewTenant({ email }));

    jest.spyOn(authService, 'generateTenant').mockReturnValue(of(tenant));

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.generateNewTenantSuccess({
      tenantId: tenant.id,
    });

    let result: any;
    authEffects.generateTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch generateNewTenantFailure action on tenant generation failure', fakeAsync(() => {
    const error = new Error('Tenant generation failed');
    const email = 'john@example.com';
    const actions$ = of(AuthActions.generateNewTenant({ email }));

    jest
      .spyOn(authService, 'generateTenant')
      .mockReturnValue(throwError(error));

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.generateNewTenantFailure({
      error,
    });

    let result: any;
    authEffects.generateTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should invite user successfully', fakeAsync(() => {
    const recipientEmail = 'john@example.com';
    const actions$ = of(AuthActions.inviteUser({ recipientEmail }));

    jest.spyOn(authService, 'inviteUser').mockReturnValue(
      of({
        email: recipientEmail,
      }),
    );

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.inviteUserSuccess({
      invitedUser: {
        email: recipientEmail,
      },
    });

    let result: any;
    authEffects.inviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should uninvite user successfully', fakeAsync(() => {
    const userEmail = 'john@example.com';
    const actions$ = of(AuthActions.unInviteUser({ userEmail }));

    jest.spyOn(authService, 'uninviteUser').mockReturnValue(
      of({
        email: userEmail,
        isMainUser: false,
      }),
    );

    const authEffects = new AuthEffects(
      actions$,
      keycloakService,
      authService,
      createMockStore({}),
      snackBar,
    );

    const expectedAction = AuthActions.unInviteUserSuccess();

    let result: any;
    authEffects.unInviteUser$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));
});
