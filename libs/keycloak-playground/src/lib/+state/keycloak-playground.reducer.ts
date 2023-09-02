import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { KeycloakPlaygroundActions } from './keycloak-playground.actions';

export const KEYCLOAK_PLAYGROUND_FEATURE_KEY = 'keycloakPlayground';

export interface KeycloakPlaygroundState {
  message: string | null;
}

export const initialPlaygroundState: KeycloakPlaygroundState = {
  // set initial required properties
  message: null,
};

export const playgroundFeature = createFeature({
  name: KEYCLOAK_PLAYGROUND_FEATURE_KEY,
  reducer: createReducer(
    initialPlaygroundState,
    on(KeycloakPlaygroundActions.adminCallSuccess, (state, { message }) => ({
      ...state,
      message,
    }))
  ),
  extraSelectors: ({ selectMessage }) => ({
    selectIsMessagePresent: createSelector(
      selectMessage,
      (message) => message != null
    ),
  }),
});
