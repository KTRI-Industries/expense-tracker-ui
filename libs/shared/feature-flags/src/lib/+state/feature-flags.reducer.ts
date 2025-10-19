import { createFeature, createReducer, on } from '@ngrx/store';
import { FeatureFlagsResponse } from '@expense-tracker-ui/shared/api';
import { FeatureFlagActions } from './feature-flags.actions';

export const FEATURE_FLAGS_FEATURE_KEY = 'featureFlags';

export interface FeatureFlagsState {
  flags: FeatureFlagsResponse;
  loaded: boolean;
}

export const initialFeatureFlagsState: FeatureFlagsState = {
  flags: {
    importTransactions: false, // Safe default: feature disabled
  },
  loaded: false,
};

export const featureFlagsFeature = createFeature({
  name: FEATURE_FLAGS_FEATURE_KEY,
  reducer: createReducer(
    initialFeatureFlagsState,
    on(FeatureFlagActions.loadFeatureFlagsSuccess, (state, { flags }) => ({
      ...state,
      flags,
      loaded: true,
    })),
    on(FeatureFlagActions.loadFeatureFlagsFailure, (state) => ({
      ...state,
      loaded: true, // Mark as loaded even on failure to use safe defaults
    })),
  ),
});
