import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserInfo } from '@expense-tracker-ui/api';

export const KeycloakPlaygroundActions = createActionGroup({
  source: 'Keycloak',
  events: {
    AdminCall: emptyProps(),
    'Admin Call Success': props<{ message: UserInfo }>(),
    'Admin Call Error': props<{ error: Error }>(),
  },
});
