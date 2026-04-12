import { accountFeature } from './account.reducer';

export const {
  selectAccounts,
  selectCurrentAccount,
  selectCurrentAccountCurrency,
  selectCurrentAccountOwnerEmail,
  selectPendingAccountInvitations,
  selectIsUserCurrentAccountOwner,
} = accountFeature;
