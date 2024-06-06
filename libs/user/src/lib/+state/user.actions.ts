import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { InvitedUserDto } from '@expense-tracker-ui/api';

export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Invite User': props<{ recipientEmail: string }>(),
    'Invite User Success': props<{ invitedUser: InvitedUserDto }>(),
    'Invite User Failure': props<{ error: Error }>(),
    'UnInvite User': props<{ userEmail: string }>(),
    'UnInvite User Success': emptyProps(),
    'UnInvite User Failure': props<{ error: Error }>(),
  },
});
