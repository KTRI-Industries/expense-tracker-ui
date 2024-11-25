import * as DashboardActions from './lib/+state/dashboard.actions';

import * as DashboardFeature from './lib/+state/dashboard.reducer';

import * as DashboardSelectors from './lib/+state/dashboard.selectors';

import { DashboardEffects } from './lib/+state/dashboard.effects';

export * from './lib/+state/dashboard.models';

export {
  DashboardActions,
  DashboardFeature,
  DashboardSelectors,
  DashboardEffects,
};

export * from './lib/+state/dashboard.reducer';

// export * from './lib/lib.routes';

export * from './lib/dashboard.component';
export * from './lib/dashboard-container.component';
