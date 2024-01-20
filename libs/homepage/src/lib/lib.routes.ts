import { Route } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromHomepage from './+state/homepage.reducer';
import { HomepageEffects } from './+state/homepage.effects';

export const homepageRoutes: Route[] = [
  {
    path: '',
    component: HomepageComponent,
    providers: [
      provideState(
        fromHomepage.HOMEPAGE_FEATURE_KEY,
        fromHomepage.homepageReducer,
      ),
      provideEffects(HomepageEffects),
    ],
  },
];
