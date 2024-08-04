import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';

export const AccountActions = createActionGroup({
  source: 'Account',
  events: {
    'Retrieve Accounts': emptyProps(),
    'Retrieve Accounts Success': props<{ accounts: TenantWithUserDetails[] }>(),
    'Retrieve Accounts Failure': props<{ error: Error }>(),

    'Set Default Account': props<{ tenantId: string }>(),
    'Set Default Account Success': emptyProps(),
    'Set Default Account Failure': props<{ error: Error }>(),

    'Switch Account': props<{ tenantId: string }>(),
    'Switch Account Success': emptyProps(),
    'Switch Account Failure': props<{ error: Error }>(),

    'Associate User With Account': props<{ tenantId: string }>(),
    'Associate User With Account Success': emptyProps(),
    'Associate User With Account Failure': props<{ error: Error }>(),

    'Reject Invite': props<{ tenantId: string }>(),
    'Reject Invite Success': emptyProps(),
    'Reject Invite Failure': props<{ error: Error }>(),

    'Leave Account': props<{ tenantId: string }>(),
    'Leave Account Success': emptyProps(),
    'Leave Account Failure': props<{ error: Error }>(),
  },
});
