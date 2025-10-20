import { fakeAsync, tick } from '@angular/core/testing';
import { createMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import {
  TenantWithUserDetails,
  UserInfo,
} from '@expense-tracker-ui/shared/api';
import { AccountService } from '../account.service';
import { AccountActions } from './account.actions';
import { AccountEffects } from './account.effects';
import { KeycloakService } from 'keycloak-angular';

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
      // add other methods as needed
    } as any;
    accountService = {
      associateUserWithAccount: jest.fn(),
      setDefaultAccount: jest.fn(),
      retrieveAccounts: jest.fn(),
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

  it('should retrieve tenants successfully', fakeAsync(() => {
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

  /*it('should retrieve tenants after user profile is retrieved', fakeAsync(() => {
    const actions$ = of(
      AccountActions.retrieveUserProfileSuccess({
        keycloakUserProfile: {} as RoleAwareKeycloakProfile,
      }),
    );

    const accountEffects = new AccountEffects(
      actions$,
      accountService,
      createMockStore({}),
    );

    const expectedAction = AccountActions.retrieveTenants();

    let result: any;
    AccountEffects.retrieveTenantsAfterUserProfile$.subscribe((action) => {
      result = action;
    });

    tick();

    expect(result).toEqual(expectedAction);
  }));*/
});
