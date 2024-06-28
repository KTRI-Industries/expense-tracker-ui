import { createFeature, createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { TenantWithUserDetails } from '@expense-tracker-ui/api';

export const USER_FEATURE_KEY = 'user';

export interface UserState {
  tenants: TenantWithUserDetails[];
}

export const initialUserState: UserState = {
  // set initial required properties

  tenants: [],
};

export const userFeature = createFeature({
  name: USER_FEATURE_KEY,
  reducer: createReducer(
    initialUserState,
    on(UserActions.retrieveTenantsSuccess, (state, { tenants }) => ({
      ...state,
      tenants,
    })),
  ),
});
