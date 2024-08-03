import { createFeature, createReducer, createSelector, on } from '@ngrx/store';

import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { AccountActions } from './account.actions';
import {
  AuthSelectors,
  RoleAwareKeycloakProfile,
  TenantAwareKeycloakProfile,
} from '@expense-tracker-ui/shared/auth';

export const ACCOUNT_FEATURE_KEY = 'account';

export interface AccountState {
  accounts: TenantWithUserDetails[];
  currentAccount: string;
}

export const initialAccountState: AccountState = {
  accounts: [],
  currentAccount: '',
};

export const accountFeature = createFeature({
  name: ACCOUNT_FEATURE_KEY,
  reducer: createReducer(
    initialAccountState,
    on(AccountActions.retrieveAccountsSuccess, (state, { accounts }) => ({
      ...state,
      accounts,
      currentAccount: state.currentAccount
        ? state.currentAccount
        : (accounts.find((account) => account.isDefault)?.id ?? ''),
    })),
    on(AccountActions.setDefaultAccount, (state, { tenantId }) => ({
      ...state,
      currentAccount: tenantId,
    })),
    on(AccountActions.switchAccount, (state, { tenantId }) => ({
      ...state,
      currentAccount: tenantId,
    })),
  ),
  extraSelectors: ({ selectAccounts, selectCurrentAccount }) => ({
    selectCurrentAccountOwnerEmail: createSelector(
      selectAccounts,
      selectCurrentAccount,
      (accounts: TenantWithUserDetails[], currentAccount) =>
        accounts.find((account) => account.id === currentAccount)
          ?.mainUserEmail,
    ),
    selectPendingAccountInvitations: createSelector(
      selectAccounts,
      (accounts) =>
        accounts.filter(
          (account) => !account.isAssociated && !account.isCurrentUserOwner,
        ).length,
    ),
    selectIsUserCurrentAccountOwner: createSelector(
      AuthSelectors.selectUserProfile,
      selectCurrentAccount,
      selectAccounts,
      (userProfile, currentAccount, accounts) => {
        return (
          hasAccountOwnerRole(userProfile) &&
          isOwnerOfCurrentAccount(accounts, currentAccount, userProfile)
        );
      },
    ),
  }),
});

function hasAccountOwnerRole(userProfile: TenantAwareKeycloakProfile | null) {
  const userRoles = (userProfile as RoleAwareKeycloakProfile)?.userRoles;
  return userRoles?.includes('tenant-owner');
}

function isOwnerOfCurrentAccount(
  accounts: TenantWithUserDetails[],
  currentAccount: string,
  userProfile: TenantAwareKeycloakProfile | null,
) {
  return (
    accounts.find((account) => account.id === currentAccount)?.mainUserEmail ===
    userProfile?.email
  );
}
