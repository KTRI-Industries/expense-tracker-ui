import { Route } from '@angular/router';
import { UserComponent } from './user/user.component';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import * as fromUser from './+state/user.reducer';
import { UserEffects } from './+state/user.effects';

export const userRoutes: Route[] = [
  {
    path: '',
    component: UserComponent,
    providers: [
      provideState(fromUser.USER_FEATURE_KEY, fromUser.userReducer),
      provideEffects(UserEffects),
    ],
  },
];
