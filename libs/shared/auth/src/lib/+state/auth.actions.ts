import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInfo } from '@expense-tracker-ui/shared/api';
import { RoleAwareKeycloakProfile } from './auth.reducer';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Check login': emptyProps(),
    'Check Login Failure': props<{ error: Error }>(),

    Login: emptyProps(),
    'Login Success': emptyProps(),

    Logout: emptyProps(),

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

    /* 'Switch Tenant': props<{ tenantId: string }>(),
    'Switch Tenant Success': emptyProps(),
    'Switch Tenant Failure': props<{ error: Error }>(),

    'Set Default Tenant': props<{ tenantId: string }>(),
    'Set Default Tenant Success': emptyProps(),
    'Set Default Tenant Failure': props<{ error: Error }>(),*/

    'Refresh User Roles': emptyProps(),
    'Refresh User Roles Success': props<{ userRoles: Array<string> }>(),
    'Refresh User Roles Failure': props<{ error: Error }>(),

    /* 'Retrieve Tenants': emptyProps(),
    'Retrieve Tenants Success': props<{ tenants: TenantWithUserDetails[] }>(),
    'Retrieve Tenants Failure': props<{ error: Error }>(),*/
  },
});
