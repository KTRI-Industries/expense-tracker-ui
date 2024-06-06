import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInfo } from '@expense-tracker-ui/api';
import { RoleAwareKeycloakProfile } from './auth.reducer';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Check login': emptyProps(),
    'Check Login Failure': props<{ error: Error }>(),
    Login: emptyProps(),
    Logout: emptyProps(),
    'Login Success': emptyProps(),
    'Retrieve User Profile Success': props<{
      keycloakUserProfile: RoleAwareKeycloakProfile;
    }>(),
    'Retrieve User Profile Failure': props<{ error: Error }>(),
    'Generate New Tenant': props<{ email: string }>(),
    'Generate New Tenant Success': props<{ tenantId: string }>(),
    'Generate New Tenant Failure': props<{ error: Error }>(),

    'Retrieve Tenant Users': emptyProps(),
    'Retrieve Tenant Users Success': props<{ users: Array<UserInfo> }>(),
    'Retrieve Tenant Users Failure': props<{ error: Error }>(),
  },
});
