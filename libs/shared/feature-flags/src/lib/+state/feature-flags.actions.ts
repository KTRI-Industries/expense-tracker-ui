import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { FeatureFlagsResponse } from '@expense-tracker-ui/shared/api';

export const FeatureFlagActions = createActionGroup({
  source: 'FeatureFlags',
  events: {
    'Load Feature Flags': emptyProps(),
    'Load Feature Flags Success': props<{ flags: FeatureFlagsResponse }>(),
    'Load Feature Flags Failure': props<{ error: Error }>(),
  },
});
