import {
  authFeature,
  AuthState,
  RoleAwareKeycloakProfile,
} from './auth.reducer';
import { AuthActions } from './auth.actions';
import {
  selectIsLoggedIn,
  selectTenantId,
  selectUserName,
} from './auth.selectors';
import { Action } from '@ngrx/store';
import { UserInfo } from '@expense-tracker-ui/shared/api';

describe('AuthReducer', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const actualState = authFeature.reducer(undefined, {} as Action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('retrieveUserProfileSuccess action', () => {
    it('should set the userProfile property', () => {
      const expectedState: AuthState = {
        userProfile: {
          id: '1234567890',
          username: 'test-user',
          firstName: 'Test',
          lastName: 'User',
        },
        tenantUsers: [],
      };

      const actualState = authFeature.reducer(
        {
          userProfile: null,
          tenantUsers: [],
        },
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: expectedState.userProfile || {},
        }),
      );

      expect(actualState).toEqual(expectedState);
    });

    it('should handle null TENANT_ID attribute', () => {
      const initialState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const userProfile = {
        id: '1234567890',
        username: 'test-user',
        firstName: 'Test',
        lastName: 'User',
        attributes: undefined,
      };

      const expectedState: AuthState = {
        userProfile: {
          ...userProfile,
          tenantId: undefined,
        },
        tenantUsers: [],
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: userProfile,
        }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('generateNewTenantSuccess action', () => {
    it('should set the tenantId property of userProfile', () => {
      const initialState: AuthState = {
        userProfile: {
          id: '1234567890',
          username: 'test-user',
          firstName: 'Test',
          lastName: 'User',
        },
        tenantUsers: [],
      };

      const tenantId = 'tenant-123';
      const expectedState: AuthState = {
        userProfile: {
          ...initialState.userProfile,
          tenantId,
        },
        tenantUsers: [],
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.generateNewTenantSuccess({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('retrieveTenantUsersSuccess action', () => {
    it('should set the tenantUsers property', () => {
      const initialState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const tenantUsers: UserInfo[] = [
        {
          userId: '1',
          username: 'user1',
          email: 'user1@example.com',
          isMainUser: true,
        },
        {
          userId: '2',
          username: 'user2',
          email: 'user2@example.com',
          isMainUser: true,
        },
      ];

      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers,
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.retrieveTenantUsersSuccess({ users: tenantUsers }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  /*describe('switchTenant action', () => {
    it('should set the currentTenant property', () => {
      const initialState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const tenantId = 'tenant-123';
      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers: [],
        tenants: [],
        currentTenant: tenantId,
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.switchTenant({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('setDefaultTenant action', () => {
    it('should set the currentTenant property', () => {
      const initialState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const tenantId = 'tenant-123';
      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers: [],
        tenants: [],
        currentTenant: tenantId,
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.setDefaultTenant({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });*/

  describe('refreshUserRolesSuccess action', () => {
    it('should set the userRoles property of userProfile', () => {
      const initialState: AuthState = {
        userProfile: {
          id: '1234567890',
          username: 'test-user',
          firstName: 'Test',
          lastName: 'User',
        },
        tenantUsers: [],
      };

      const userRoles = ['role1', 'role2'];
      const expectedState: AuthState = {
        userProfile: {
          ...initialState.userProfile,
          userRoles,
        } as RoleAwareKeycloakProfile,
        tenantUsers: [],
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.refreshUserRolesSuccess({ userRoles }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  /*describe('retrieveTenantsSuccess action', () => {
    it('should set the tenants property and currentTenant if not set', () => {
      const initialState: AuthState = {
        userProfile: null,
        tenantUsers: [],
      };

      const tenants: TenantWithUserDetails[] = [
        {
          id: 'tenant-123',
          isDefault: true,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
        {
          id: 'tenant-456',
          isDefault: false,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
      ];

      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers: [],
        tenants,
        currentTenant: 'tenant-123',
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.retrieveTenantsSuccess({ tenants }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });*/

  describe('AuthSelector', () => {
    let authState: AuthState;

    beforeEach(() => {
      authState = {
        userProfile: null,
        tenantUsers: [],
      };
    });

    it('should return true if the userProfile is not null', () => {
      authState.userProfile = {
        id: '1234567890',
        username: 'test-user',
        firstName: 'Test',
        lastName: 'User',
      };

      const isLoggedIn = selectIsLoggedIn.projector(authState.userProfile);

      expect(isLoggedIn).toBeTruthy();
    });

    it('should return false if the userProfile is null', () => {
      const isLoggedIn = selectIsLoggedIn.projector(authState.userProfile);

      expect(isLoggedIn).toBeFalsy();
    });

    it('should return undefined username if the userProfile is undefined', () => {
      const username = selectUserName.projector(null);

      expect(username).toBeUndefined();
    });

    it('should return the username if the userProfile is defined', () => {
      const userProfile = {
        id: '1234567890',
        username: 'test-user',
        firstName: 'Test',
        lastName: 'User',
      };

      const username = selectUserName.projector(userProfile);

      expect(username).toEqual('test-user');
    });

    it('should return the tenantId if the userProfile is defined', () => {
      const userProfile = {
        id: '1234567890',
        username: 'test-user',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'tenant-123',
      };

      const tenantId = selectTenantId.projector(userProfile);

      expect(tenantId).toEqual('tenant-123');
    });

    it('should return undefined tenantId if the userProfile is undefined', () => {
      const tenantId = selectTenantId.projector(null);

      expect(tenantId).toBeUndefined();
    });

    /* it('should return the currentTenantOwnerEmail if the tenants and currentTenant are defined', () => {
      const tenants: TenantWithUserDetails[] = [
        {
          id: 'tenant-123',
          isDefault: true,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
        {
          id: 'tenant-456',
          isDefault: false,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
      ];
      const currentTenant = 'tenant-123';

      const currentTenantOwnerEmail = selectCurrentTenantOwnerEmail.projector(
        tenants,
        currentTenant,
      );

      expect(currentTenantOwnerEmail).toEqual('main@example.com');
    });

    it('should return undefined currentTenantOwnerEmail if no tenants', () => {
      const currentTenantOwnerEmail = selectCurrentTenantOwnerEmail.projector(
        [],
        '',
      );

      expect(currentTenantOwnerEmail).toBeUndefined();
    });

    it('should return undefined currentTenantOwnerEmail if the currentTenant is empty', () => {
      const tenants: TenantWithUserDetails[] = [
        {
          id: 'tenant-123',
          isDefault: true,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
        {
          id: 'tenant-456',
          isDefault: false,
          mainUserEmail: 'main@example.com',
          isAssociated: true,
          isCurrentUserOwner: true,
        },
      ];

      const currentTenantOwnerEmail = selectCurrentTenantOwnerEmail.projector(
        tenants,
        '',
      );

      expect(currentTenantOwnerEmail).toBeUndefined();
    });*/
  });
});
