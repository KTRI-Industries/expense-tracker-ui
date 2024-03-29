import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ErrorHandlingActions = createActionGroup({
  source: 'ErrorHandling',
  events: {
    'Handle BackEnd Error': props<{ message: string }>(),
    'Clear BackEnd Error': emptyProps(),
  },
});
