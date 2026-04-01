import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';
import { of, throwError } from 'rxjs';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';
import { AuthService } from '../auth.service';
import { createMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { TenantDto } from '@expense-tracker-ui/shared/api';
import { fakeAsync, tick } from '@angular/core/testing';
import { PasskeyService } from '../passkey.service';
import { MatDialog } from '@angular/material/dialog';
import { RoleAwareKeycloakProfile } from './auth.reducer';
import { selectUserProfile } from './auth.selectors';
import { FeatureFlagActions } from '@expense-tracker-ui/shared/feature-flags';

describe('AuthEffects', () => {
  let keycloakService: KeycloakService;
  let authService: AuthService;
  let passkeyService: PasskeyService;
  let dialog: MatDialog;

  function createEffects(
    actions$: any,
    store: Store = createMockStore({}) as unknown as Store,
  ) {
    return new AuthEffects(
      actions$,
      keycloakService,
      authService,
      store as unknown as Store,
      passkeyService,
      dialog,
    );
  }

  beforeEach(() => {
    keycloakService = {
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: jest.fn(),
      loadUserProfile: jest.fn(),
      getUserRoles: jest.fn().mockReturnValue(['users']),
      updateToken: jest.fn().mockResolvedValue(true),
    } as any;
    authService = {
      generateTenant: jest.fn(),
    } as any;
    passkeyService = {
      hasPasskey: jest.fn().mockReturnValue(of(false)),
      shouldShowPasskeyPrompt: jest.fn().mockReturnValue(false),
      dismissPasskeyPrompt: jest.fn(),
      openSecurityPage: jest.fn(),
      getSecurityUrl: jest
        .fn()
        .mockReturnValue('https://keycloak.example.com/security'),
    } as any;
    dialog = {
      open: jest.fn().mockReturnValue({ afterClosed: () => of('later') }),
    } as any;
  });

  it('should log in user when login action is triggered', fakeAsync(() => {
    const actions$ = of(AuthActions.login());

    jest.spyOn(keycloakService, 'login');

    const authEffects = createEffects(actions$);

    authEffects.login$.subscribe();

    tick();

    expect(keycloakService.login).toHaveBeenCalled();
  }));

  it('should log out user and redirect to base url when logout action is triggered', fakeAsync(() => {
    const actions$ = of(AuthActions.logout());

    jest.spyOn(keycloakService, 'logout');

    const authEffects = createEffects(actions$);

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

    const authEffects = createEffects(actions$);

    const expectedAction = AuthActions.retrieveUserProfileSuccess({
      keycloakUserProfile: {
        ...userProfile,
        userRoles: ['users'],
      },
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

    const authEffects = createEffects(actions$);

    const expectedAction = AuthActions.loginSuccess();

    let result: any;
    authEffects.checkLogin$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should not dispatch loginSuccess when the user is not logged in', fakeAsync(() => {
    const actions$ = of(AuthActions.checkLogin());

    jest.spyOn(keycloakService, 'isLoggedIn').mockImplementation(() => false);

    const authEffects = createEffects(actions$);

    let result: any;
    authEffects.checkLogin$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toBeUndefined();
  }));

  it('should dispatch retrieveUserProfileFailure action if profile retrieval fails', fakeAsync(() => {
    const error = new Error('Profile retrieval failed');
    const actions$ = of(AuthActions.loginSuccess());

    jest
      .spyOn(keycloakService, 'loadUserProfile')
      .mockImplementation(() => Promise.reject(error));

    const authEffects = createEffects(actions$);
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

    const authEffects = createEffects(actions$);

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

    const authEffects = createEffects(actions$);

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

  it('should dispatch generateNewTenant when the retrieved user profile has no tenant', fakeAsync(() => {
    const actions$ = of(
      AuthActions.retrieveUserProfileSuccess({
        keycloakUserProfile: {} as RoleAwareKeycloakProfile,
      }),
    );
    const store = createMockStore({
      selectors: [
        {
          selector: selectUserProfile,
          value: {
            email: 'john@example.com',
            tenantId: undefined,
          },
        },
      ],
    });

    const authEffects = createEffects(actions$, store as unknown as Store);

    let result: any;
    authEffects.checkTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(
      AuthActions.generateNewTenant({ email: 'john@example.com' }),
    );
  }));

  it('should not dispatch generateNewTenant when the user already has a tenant', fakeAsync(() => {
    const actions$ = of(
      AuthActions.retrieveUserProfileSuccess({
        keycloakUserProfile: {} as RoleAwareKeycloakProfile,
      }),
    );
    const store = createMockStore({
      selectors: [
        {
          selector: selectUserProfile,
          value: {
            email: 'john@example.com',
            tenantId: 'tenant-123',
          },
        },
      ],
    });

    const authEffects = createEffects(actions$, store as unknown as Store);

    let result: any;
    authEffects.checkTenant$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toBeUndefined();
  }));

  it('should load feature flags after retrieving the user profile', fakeAsync(() => {
    const actions$ = of(
      AuthActions.retrieveUserProfileSuccess({
        keycloakUserProfile: {} as RoleAwareKeycloakProfile,
      }),
    );

    const authEffects = createEffects(actions$);

    let result: any;
    authEffects.loadFeatureFlagsAfterLogin$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(FeatureFlagActions.loadFeatureFlags());
  }));

  it('should refresh the token after a new tenant is generated', fakeAsync(() => {
    const actions$ = of(
      AuthActions.generateNewTenantSuccess({ tenantId: 'tenant-123' }),
    );

    const authEffects = createEffects(actions$);

    let result: any;
    authEffects.refreshTokenAfterTenantGenerated$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(keycloakService.updateToken).toHaveBeenCalledWith(-1);
    expect(result).toEqual(AuthActions.retrieveTenantUsers());
  }));

  it('should refresh roles after tenant is generated', fakeAsync(() => {
    const actions$ = of(
      AuthActions.generateNewTenantSuccess({
        tenantId: 'tenant-123',
      }),
    );

    const authEffects = createEffects(actions$);

    jest
      .spyOn(authEffects, 'refreshRoles')
      .mockImplementation(() => Promise.resolve(['role1', 'role2']));

    const expectedAction = AuthActions.refreshUserRolesSuccess({
      userRoles: ['role1', 'role2'],
    });

    let result: any;
    authEffects.refreshRolesAfterTenantGenerated$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch refreshUserRolesFailure when refreshing roles fails', fakeAsync(() => {
    const actions$ = of(
      AuthActions.generateNewTenantSuccess({
        tenantId: 'tenant-123',
      }),
    );
    const error = new Error('roles failed');

    const authEffects = createEffects(actions$);

    jest.spyOn(authEffects, 'refreshRoles').mockRejectedValue(error);

    let result: any;
    authEffects.refreshRolesAfterTenantGenerated$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(
      AuthActions.refreshUserRolesFailure({ error }),
    );
  }));

  describe('checkPasskeyStatus$', () => {
    it('should dispatch showPasskeyPrompt when user has no passkey and prompt not dismissed', fakeAsync(() => {
      const actions$ = of(
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: {} as RoleAwareKeycloakProfile,
        }),
      );

      jest
        .spyOn(passkeyService, 'shouldShowPasskeyPrompt')
        .mockReturnValue(true);
      jest.spyOn(passkeyService, 'hasPasskey').mockReturnValue(of(false));

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.checkPasskeyStatus$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toEqual(AuthActions.showPasskeyPrompt());
    }));

    it('should not dispatch when passkey prompt is dismissed', fakeAsync(() => {
      const actions$ = of(
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: {} as RoleAwareKeycloakProfile,
        }),
      );

      jest
        .spyOn(passkeyService, 'shouldShowPasskeyPrompt')
        .mockReturnValue(false);

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.checkPasskeyStatus$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toBeUndefined();
    }));

    it('should not dispatch when user already has a passkey', fakeAsync(() => {
      const actions$ = of(
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: {} as RoleAwareKeycloakProfile,
        }),
      );

      jest
        .spyOn(passkeyService, 'shouldShowPasskeyPrompt')
        .mockReturnValue(true);
      jest.spyOn(passkeyService, 'hasPasskey').mockReturnValue(of(true));

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.checkPasskeyStatus$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toBeUndefined();
    }));

    it('should not dispatch when passkey lookup fails', fakeAsync(() => {
      const actions$ = of(
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: {} as RoleAwareKeycloakProfile,
        }),
      );
      const error = new Error('passkey lookup failed');

      jest
        .spyOn(passkeyService, 'shouldShowPasskeyPrompt')
        .mockReturnValue(true);
      jest
        .spyOn(passkeyService, 'hasPasskey')
        .mockReturnValue(throwError(() => error));

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.checkPasskeyStatus$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toBeUndefined();
    }));
  });

  describe('showPasskeyPrompt$', () => {
    it('should dispatch passkeyPromptCompleted when user clicks never', fakeAsync(() => {
      const actions$ = of(AuthActions.showPasskeyPrompt());

      jest
        .spyOn(dialog, 'open')
        .mockReturnValue({ afterClosed: () => of('never') } as any);

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.showPasskeyPrompt$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(dialog.open).toHaveBeenCalled();
      expect(result).toEqual(
        AuthActions.passkeyPromptCompleted({ choice: 'never' }),
      );
    }));

    it('should dispatch passkeyPromptCompleted when user clicks setup', fakeAsync(() => {
      const actions$ = of(AuthActions.showPasskeyPrompt());

      jest
        .spyOn(dialog, 'open')
        .mockReturnValue({ afterClosed: () => of('setup') } as any);

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.showPasskeyPrompt$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toEqual(
        AuthActions.passkeyPromptCompleted({ choice: 'setup' }),
      );
    }));

    it('should dispatch passkeyPromptCompleted when user clicks not now', fakeAsync(() => {
      const actions$ = of(AuthActions.showPasskeyPrompt());

      jest
        .spyOn(dialog, 'open')
        .mockReturnValue({ afterClosed: () => of('later') } as any);

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.showPasskeyPrompt$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(dialog.open).toHaveBeenCalled();
      expect(result).toEqual(
        AuthActions.passkeyPromptCompleted({ choice: 'later' }),
      );
    }));

    it('should default to later when dialog closes without a choice', fakeAsync(() => {
      const actions$ = of(AuthActions.showPasskeyPrompt());

      jest
        .spyOn(dialog, 'open')
        .mockReturnValue({ afterClosed: () => of(undefined) } as any);

      const authEffects = createEffects(actions$);

      let result: any;
      authEffects.showPasskeyPrompt$.subscribe((action) => {
        result = action;
      });

      tick();

      expect(result).toEqual(
        AuthActions.passkeyPromptCompleted({ choice: 'later' }),
      );
    }));
  });

  describe('openPasskeySecurityPage$', () => {
    it('should open security page when choice is setup', fakeAsync(() => {
      const actions$ = of(
        AuthActions.passkeyPromptCompleted({ choice: 'setup' }),
      );

      const authEffects = createEffects(actions$);

      authEffects.openPasskeySecurityPage$.subscribe();

      tick();

      expect(passkeyService.openSecurityPage).toHaveBeenCalled();
    }));

    it('should not open security page when choice is not setup', fakeAsync(() => {
      const actions$ = of(
        AuthActions.passkeyPromptCompleted({ choice: 'later' }),
      );

      const authEffects = createEffects(actions$);

      authEffects.openPasskeySecurityPage$.subscribe();

      tick();

      expect(passkeyService.openSecurityPage).not.toHaveBeenCalled();
    }));
  });

  describe('persistPasskeyPromptDismissal$', () => {
    it('should persist dismissal when choice is never', fakeAsync(() => {
      const actions$ = of(
        AuthActions.passkeyPromptCompleted({ choice: 'never' }),
      );

      const authEffects = createEffects(actions$);

      authEffects.persistPasskeyPromptDismissal$.subscribe();

      tick();

      expect(passkeyService.dismissPasskeyPrompt).toHaveBeenCalled();
    }));

    it('should not persist dismissal when choice is later', fakeAsync(() => {
      const actions$ = of(
        AuthActions.passkeyPromptCompleted({ choice: 'later' }),
      );

      const authEffects = createEffects(actions$);

      authEffects.persistPasskeyPromptDismissal$.subscribe();

      tick();

      expect(passkeyService.dismissPasskeyPrompt).not.toHaveBeenCalled();
    }));
  });
});
