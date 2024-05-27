import { Route } from '@angular/router';
import { InviteUserContainerComponent } from './user/invite-user-container.component';
import { UserPageContainerComponent } from './user-page-container.component';
import { AppGuard } from '@expense-tracker-ui/shared/auth';

export const userRoutes: Route[] = [
  {
    path: '',
    component: UserPageContainerComponent,
    providers: [
      // provideState(fromUser.USER_FEATURE_KEY, fromUser.userReducer),
      // provideEffects(UserEffects),
    ],
  },
  {
    path: 'invite',
    component: InviteUserContainerComponent,
    canActivate: [AppGuard],
    data: {
      roles: ['users', 'tenant-owner'],
    },
  },
];
