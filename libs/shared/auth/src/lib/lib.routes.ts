import { Route } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromAuth from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthComponent,
    providers: [
      provideState(fromAuth.AUTH_FEATURE_KEY, fromAuth.authReducer),
      provideEffects(AuthEffects),
    ],
  },
];
