import { authFeature, AuthState } from './auth.reducer';
import { AuthActions } from './auth.actions';
import { selectIsLoggedIn, selectUserName } from './auth.selectors';
import { Action } from '@ngrx/store';

describe('AuthReducer', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      const expectedState: AuthState = {
        userProfile: null,
        tenantUsers: [],
        tenants: [],
        currentTenant: '',
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
        tenants: [],
        currentTenant: '',
      };

      const actualState = authFeature.reducer(
        {
          userProfile: null,
          tenantUsers: [],
          tenants: [],
          currentTenant: '',
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
        tenants: [],
        currentTenant: '',
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
        tenants: [],
        currentTenant: '',
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
        tenants: [],
        currentTenant: '',
      };

      const tenantId = 'tenant-123';
      const expectedState: AuthState = {
        userProfile: {
          ...initialState.userProfile,
          tenantId,
        },
        tenantUsers: [],
        tenants: [],
        currentTenant: '',
      };

      const actualState = authFeature.reducer(
        initialState,
        AuthActions.generateNewTenantSuccess({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('AuthSelector', () => {
    let authState: AuthState;

    beforeEach(() => {
      authState = {
        userProfile: null,
        tenantUsers: [],
        tenants: [],
        currentTenant: '',
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
  });
});
