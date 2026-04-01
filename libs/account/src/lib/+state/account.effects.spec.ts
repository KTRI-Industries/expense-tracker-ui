import { fakeAsync, tick } from '@angular/core/testing';
import { createMockStore } from '@ngrx/store/testing';
import { of, throwError } from 'rxjs';

import {
  TenantWithUserDetails,
  UserInfo,
} from '@expense-tracker-ui/shared/api';
import { AccountService } from '../account.service';
import { AccountActions } from './account.actions';
import { AccountEffects } from './account.effects';
import { KeycloakService } from 'keycloak-angular';
import {
  AuthActions,
  RoleAwareKeycloakProfile,
} from '@expense-tracker-ui/shared/auth';

describe('AccountEffects', () => {
  let accountService: AccountService;
  let keycloakService: KeycloakService;

  beforeEach(() => {
    keycloakService = {
      login: jest.fn(),
      logout: jest.fn(),
      isLoggedIn: jest.fn(),
      loadUserProfile: jest.fn(),
      getUserRoles: jest.fn(),
      updateToken: jest.fn().mockResolvedValue(true),
    } as any;
    accountService = {
      associateUserWithAccount: jest.fn(),
      setDefaultAccount: jest.fn(),
      retrieveAccounts: jest.fn(),
      rejectInvite: jest.fn(),
      leaveAccount: jest.fn(),
    } as any;
  });

  it('should associate account successfully', fakeAsync(() => {
    const tenantId = 'account-123';
    const actions$ = of(AccountActions.associateUserWithAccount({ tenantId }));

    const userInfo = {} as UserInfo;
    jest
      .spyOn(accountService, 'associateUserWithAccount')
      .mockReturnValue(of(userInfo));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = AccountActions.associateUserWithAccountSuccess();

    let result: any;
    accountEffects.associateUserWithAccount$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should set default account successfully', fakeAsync(() => {
    const tenantId = 'account-123';
    const actions$ = of(AccountActions.setDefaultAccount({ tenantId }));

    const userInfo = {} as UserInfo;

    jest
      .spyOn(accountService, 'setDefaultAccount')
      .mockReturnValue(of(userInfo));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = AccountActions.setDefaultAccountSuccess();

    let result: any;
    accountEffects.setDefaultAccount$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch setDefaultAccountFailure when setting the default account fails', fakeAsync(() => {
    const tenantId = 'account-123';
    const error = new Error('default account failed');
    const actions$ = of(AccountActions.setDefaultAccount({ tenantId }));

    jest
      .spyOn(accountService, 'setDefaultAccount')
      .mockReturnValue(throwError(() => error));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.setDefaultAccount$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(
      AccountActions.setDefaultAccountFailure({ error }),
    );
  }));

  it('should retrieve accounts successfully', fakeAsync(() => {
    const accounts: TenantWithUserDetails[] = [
      {
        id: 'account-123',
        isDefault: true,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
      {
        id: 'account-456',
        isDefault: false,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
    ];
    const actions$ = of(AccountActions.retrieveAccounts());

    jest
      .spyOn(accountService, 'retrieveAccounts')
      .mockReturnValue(of(accounts));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = AccountActions.retrieveAccountsSuccess({ accounts });

    let result: any;
    accountEffects.retrieveUserAccounts$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch retrieveAccountsFailure when retrieving accounts fails', fakeAsync(() => {
    const error = new Error('retrieve accounts failed');
    const actions$ = of(AccountActions.retrieveAccounts());

    jest
      .spyOn(accountService, 'retrieveAccounts')
      .mockReturnValue(throwError(() => error));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.retrieveUserAccounts$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(
      AccountActions.retrieveAccountsFailure({ error }),
    );
  }));

  it('should reject an invite successfully', fakeAsync(() => {
    const tenantId = 'account-123';
    const actions$ = of(AccountActions.rejectInvite({ tenantId }));

    jest.spyOn(accountService, 'rejectInvite').mockReturnValue(of({} as UserInfo));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.rejectInvite$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(AccountActions.rejectInviteSuccess());
  }));

  it('should dispatch rejectInviteFailure when rejecting an invite fails', fakeAsync(() => {
    const tenantId = 'account-123';
    const error = new Error('reject invite failed');
    const actions$ = of(AccountActions.rejectInvite({ tenantId }));

    jest
      .spyOn(accountService, 'rejectInvite')
      .mockReturnValue(throwError(() => error));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.rejectInvite$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(AccountActions.rejectInviteFailure({ error }));
  }));

  it('should leave account successfully', fakeAsync(() => {
    const tenantId = 'account-123';
    const actions$ = of(AccountActions.leaveAccount({ tenantId }));

    const userInfo = {} as UserInfo;
    jest.spyOn(accountService, 'leaveAccount').mockReturnValue(of(userInfo));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    const expectedAction = AccountActions.leaveAccountSuccess();

    let result: any;
    accountEffects.leaveAccount$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));

  it('should dispatch leaveAccountFailure when leaving an account fails', fakeAsync(() => {
    const tenantId = 'account-123';
    const error = new Error('leave account failed');
    const actions$ = of(AccountActions.leaveAccount({ tenantId }));

    jest
      .spyOn(accountService, 'leaveAccount')
      .mockReturnValue(throwError(() => error));

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.leaveAccount$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(AccountActions.leaveAccountFailure({ error }));
  }));

  it('should dispatch retrieveAccounts after account-changing actions', fakeAsync(() => {
    const actions$ = of(AccountActions.setDefaultAccountSuccess());

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.retrieveAccountsAfterAccountChangeAction$.subscribe(
      (action) => {
        result = action;
      },
    );

    tick();

    expect(result).toEqual(AccountActions.retrieveAccounts());
  }));

  it('should refresh the token and retrieve tenant users after associating an account', fakeAsync(() => {
    const actions$ = of(AccountActions.associateUserWithAccountSuccess());

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.refreshTokenAndRetrieveUsersForAccountAssociatedOrLeft$.subscribe(
      (action) => {
        result = action;
      },
    );

    tick();

    expect(keycloakService.updateToken).toHaveBeenCalledWith(-1);
    expect(result).toEqual(AuthActions.retrieveTenantUsers());
  }));

  it('should retrieve accounts after the user profile is retrieved', fakeAsync(() => {
    const actions$ = of(
      AuthActions.retrieveUserProfileSuccess({
        keycloakUserProfile: {} as RoleAwareKeycloakProfile,
      }),
    );

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
      keycloakService,
    );

    let result: any;
    accountEffects.retrieveTenantsAfterUserProfile$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(AccountActions.retrieveAccounts());
  }));
});
