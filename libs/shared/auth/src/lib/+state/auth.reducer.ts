import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';
import { AuthActions } from './auth.actions';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  userProfile: KeycloakProfile | null;
}

export const initialAuthState: AuthState = {
  // set initial required properties
  userProfile: null,
};

export const authFeature = createFeature({
  name: AUTH_FEATURE_KEY,
  reducer: createReducer(
    initialAuthState,
    on(AuthActions.retrieveUserProfileSuccess, (state, { userProfile }) => ({
      ...state,
      userProfile,
    }))
  ),
  extraSelectors: ({ selectUserProfile }) => ({
    selectIsLoggedIn: createSelector(
      selectUserProfile,
      (userProfile) => userProfile != null
    ),
  }),
});
