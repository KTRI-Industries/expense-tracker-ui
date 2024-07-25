import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';
import { AuthActions } from './auth.actions';
import {
  TenantWithUserDetails,
  UserInfo,
} from '@expense-tracker-ui/shared/api';

export const AUTH_FEATURE_KEY = 'auth';
const TENANT_ID = 'tenantId';

export interface AuthState {
  userProfile: TenantAwareKeycloakProfile | null;
  tenantUsers: UserInfo[];
  tenants: TenantWithUserDetails[];
  currentTenant: string;
}

export const initialAuthState: AuthState = {
  // set initial required properties
  userProfile: null,
  tenantUsers: [],
  tenants: [],
  currentTenant: '',
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
    on(AuthActions.switchTenant, (state, { tenantId }) => ({
      ...state,
      currentTenant: tenantId,
    })),
    on(AuthActions.setDefaultTenant, (state, { tenantId }) => ({
      ...state,
      currentTenant: tenantId,
    })),

    on(AuthActions.refreshUserRolesSuccess, (state, { userRoles }) => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        userRoles,
      },
    })),
    on(AuthActions.retrieveTenantsSuccess, (state, { tenants }) => ({
      ...state,
      tenants,
      currentTenant: state.currentTenant
        ? state.currentTenant
        : (tenants.find((tenant) => tenant.isDefault)?.id ?? ''),
    })),
  ),
  extraSelectors: ({
    selectUserProfile,
    selectTenantUsers,
    selectTenants,
    selectCurrentTenant,
  }) => ({
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
    selectCurrentTenantOwnerEmail: createSelector(
      selectTenants,
      selectCurrentTenant,
      (tenants: TenantWithUserDetails[], currentTenant) =>
        tenants.find((tenant) => tenant.id === currentTenant)?.mainUserEmail,
    ),
    selectPendingInvitations: createSelector(
      selectTenants,
      (tenants) =>
        tenants.filter(
          (tenant) => !tenant.isAssociated && !tenant.isCurrentUserOwner,
        ).length,
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
