import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { KeycloakProfile } from 'keycloak-js';
import { InvitedUserDto } from '@expense-tracker-ui/api';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Check login': emptyProps(),
    'Check Login Failure': props<{ error: Error }>(),
    Login: emptyProps(),
    Logout: emptyProps(),
    'Login Success': emptyProps(),
    'Retrieve User Profile Success': props<{
      keycloakUserProfile: KeycloakProfile;
    }>(),
    'Retrieve User Profile Failure': props<{ error: Error }>(),
    'Generate New Tenant': props<{ email: string }>(),
    'Generate New Tenant Success': props<{ tenantId: string }>(),
    'Generate New Tenant Failure': props<{ error: Error }>(),
    'Invite User': props<{ recipientEmail: string }>(),
    'Invite User Success': props<{ invitedUser: InvitedUserDto }>(),
    'Invite User Failure': props<{ error: Error }>(),
  },
});
