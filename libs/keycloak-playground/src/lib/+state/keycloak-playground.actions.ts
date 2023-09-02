import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const KeycloakPlaygroundActions = createActionGroup({
  source: 'Keycloak',
  events: {
    AdminCall: emptyProps(),
    'Admin Call Success': props<{ message: string }>(),
    'Admin Call Error': props<{ error: Error }>(),
  },
});
