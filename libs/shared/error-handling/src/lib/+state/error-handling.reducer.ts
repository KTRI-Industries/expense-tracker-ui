import { createFeature, createReducer, on } from '@ngrx/store';
import { ErrorHandlingActions } from './error-handling.actions';

export const ERROR_HANDLING_FEATURE_KEY = 'error-handling';

export interface ErrorHandlingState {
  message: string | null;
}

export const initialErrorHandlingState: ErrorHandlingState = {
  message: null,
};

export const errorHandlingFeature = createFeature({
  name: ERROR_HANDLING_FEATURE_KEY,
  reducer: createReducer(
    initialErrorHandlingState,
    on(ErrorHandlingActions.handleBackEndError, (state, { message }) => ({
      ...state,
      message,
    })),
    on(ErrorHandlingActions.clearBackEndError, (state) => ({
      ...state,
      message: null,
    })),
  ),
});
