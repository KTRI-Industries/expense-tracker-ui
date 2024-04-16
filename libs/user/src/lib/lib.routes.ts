import { Route } from '@angular/router';
import { InviteUserContainerComponent } from './user/invite-user-container.component';

export const userRoutes: Route[] = [
  {
    path: '',
    component: InviteUserContainerComponent,
    providers: [
      // provideState(fromUser.USER_FEATURE_KEY, fromUser.userReducer),
      // provideEffects(UserEffects),
    ],
  },
];
