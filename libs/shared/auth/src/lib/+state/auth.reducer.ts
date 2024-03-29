import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';
const TENANT_ID = 'tenantId';

export interface AuthState {
  userProfile: TenantAwareKeycloakProfile | null;
}

export const initialAuthState: AuthState = {
  // set initial required properties
  userProfile: null,
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(
      AuthActions.retrieveUserProfileSuccess,
      (state, { keycloakUserProfile }) => ({
        ...state,
        userProfile: userProfileWithTenant(keycloakUserProfile),
      }),
    ),
    on(AuthActions.generateNewTenantSuccess, (state, { tenantId }) => ({
      ...state,
      userProfile: {
        ...state.userProfile,
        tenantId,
      },
    })),
  ),
  extraSelectors: ({ selectUserProfile }) => ({
    selectIsLoggedIn: createSelector(
      selectUserProfile,
      (userProfile) => userProfile != null,
    ),
    selectUserName: createSelector(
      selectUserProfile,
      (userProfile) => userProfile?.username,
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
