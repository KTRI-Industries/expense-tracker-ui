import { Route } from '@angular/router';
import { InviteUserContainerComponent } from './user/invite-user-container.component';
import { UserPageContainerComponent } from './user-page-container.component';
import { AppGuard } from '@expense-tracker-ui/shared/auth';
import { UserEffects } from './+state/user.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { userFeature } from './+state/user.reducer';
import { UsersContainerComponent } from './users.container.component';
import { AccountListContainerComponent } from '@expense-tracker-ui/account';

export const userRoutes: Route[] = [
  {
    path: '',
    component: UserPageContainerComponent,
    providers: [provideState(userFeature), provideEffects(UserEffects)],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersContainerComponent,
      },
      {
        path: 'tenants',
        component: AccountListContainerComponent,
      },
    ],
  },
  {
    path: 'invite',
    component: InviteUserContainerComponent,
    canActivate: [AppGuard],
    data: {
      roles: ['users', 'tenant-owner'],
    },
    providers: [provideState(userFeature), provideEffects(UserEffects)],
  },
];
