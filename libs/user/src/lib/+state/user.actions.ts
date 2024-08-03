import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InvitedUserDto } from '@expense-tracker-ui/shared/api';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Invite User': props<{ recipientEmail: string }>(),
    'Invite User Success': props<{ invitedUser: InvitedUserDto }>(),
    'Invite User Failure': props<{ error: Error }>(),

    'UnInvite User': props<{ userEmail: string }>(),
    'UnInvite User Success': emptyProps(),
    'UnInvite User Failure': props<{ error: Error }>(),
    /*
    'Leave Tenant': props<{ tenantId: string }>(),
    'Leave Tenant Success': emptyProps(),
    'Leave Tenant Failure': props<{ error: Error }>(),*/

    /*    'Associate Tenant': props<{ tenantId: string }>(),
    'Associate Tenant Success': emptyProps(),
    'Associate Tenant Failure': props<{ error: Error }>(),*/
  },
});
