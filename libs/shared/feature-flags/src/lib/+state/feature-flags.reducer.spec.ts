import {
  featureFlagsFeature,
  initialFeatureFlagsState,
} from './feature-flags.reducer';
import { FeatureFlagActions } from './feature-flags.actions';

describe('featureFlagsFeature.reducer', () => {
  it('should return the initial state', () => {
    const state = featureFlagsFeature.reducer(undefined, { type: 'noop' });

    expect(state).toEqual(initialFeatureFlagsState);
  });

  it('should store flags and mark the feature as loaded on success', () => {
    const flags = {
      importTransactions: true,
    };

    const state = featureFlagsFeature.reducer(
      initialFeatureFlagsState,
      FeatureFlagActions.loadFeatureFlagsSuccess({ flags }),
    );

    expect(state).toEqual({
      flags,
      loaded: true,
    });
  });

  it('should keep safe defaults and mark the feature as loaded on failure', () => {
    const state = featureFlagsFeature.reducer(
      initialFeatureFlagsState,
      FeatureFlagActions.loadFeatureFlagsFailure({
        error: new Error('flags failed'),
      }),
    );

    expect(state).toEqual({
      ...initialFeatureFlagsState,
      loaded: true,
    });
  });
});
