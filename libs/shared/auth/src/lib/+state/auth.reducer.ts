import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';
import { AuthActions } from './auth.actions';
import { UserInfo } from '@expense-tracker-ui/api';

export const AUTH_FEATURE_KEY = 'auth';
const TENANT_ID = 'tenantId';

export interface AuthState {
  userProfile: TenantAwareKeycloakProfile | null;
  tenantUsers: UserInfo[];
}

export const initialAuthState: AuthState = {
  // set initial required properties
  userProfile: null,
  tenantUsers: [],
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.retrieveUserProfileSuccess,
      (state, { keycloakUserProfile }) => ({
        ...state,
        userProfile: userProfileWithTenant(
          keycloakUserProfile as AttributeAwareKeycloakProfile,
        ),
      }),
    ),
    on(AuthActions.generateNewTenantSuccess, (state, { tenantId }) => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        tenantId,
      },
    })),
    on(AuthActions.retrieveTenantUsersSuccess, (state, { users }) => ({
      ...state,
      tenantUsers: users,
    })),
  ),
  extraSelectors: ({ selectUserProfile, selectTenantUsers }) => ({
    selectIsLoggedIn: createSelector(
      selectUserProfile,
      (userProfile) => userProfile != null,
    ),
    selectUserName: createSelector(
      selectUserProfile,
      (userProfile) => userProfile?.username,
    ),
    selectIsTenantOwner: createSelector(
      selectTenantUsers,
      selectUserProfile,
      (users, userProfile) =>
        (userProfile as RoleAwareKeycloakProfile)?.userRoles?.includes(
          'tenant-owner',
        ),
    ),
    selectNonMainUsers: createSelector(selectTenantUsers, (users) =>
      users.filter((user) => !user.isMainUser),
    ),
    selectUserEmail: createSelector(
      selectUserProfile,
      (userProfile) => userProfile?.email,
    ),
    selectTenantId: createSelector(
      selectUserProfile,
      (userProfile) => userProfile?.tenantId,
    ),
  }),
});

function userProfileWithTenant(
  userProfile: AttributeAwareKeycloakProfile,
): TenantAwareKeycloakProfile {
  return {
    ...userProfile,
    tenantId: userProfile.attributes?.[TENANT_ID]?.[0],
  };
}

export interface TenantAwareKeycloakProfile extends KeycloakProfile {
  tenantId?: string;
}

export interface AttributeAwareKeycloakProfile extends KeycloakProfile {
  attributes?: Record<string, string[] | undefined>;
}

export interface RoleAwareKeycloakProfile extends KeycloakProfile {
  userRoles?: string[];
}
