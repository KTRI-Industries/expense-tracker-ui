import { Route } from '@angular/router';
import { InviteUserContainerComponent } from './user/invite-user-container.component';
import { UserPageComponent } from './user-page.component';

export const userRoutes: Route[] = [
  {
    path: '',
    component: UserPageComponent,
    providers: [
      // provideState(fromUser.USER_FEATURE_KEY, fromUser.userReducer),
      // provideEffects(UserEffects),
    ],
  },
  {
    path: 'invite',
    component: InviteUserContainerComponent,
  },
];
