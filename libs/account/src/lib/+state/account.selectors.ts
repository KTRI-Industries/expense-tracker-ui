import { accountFeature } from './account.reducer';

export const {
  selectAccounts,
  selectCurrentAccount,
  selectCurrentAccountOwnerEmail,
  selectPendingAccountInvitations,
  selectIsUserCurrentAccountOwner,
} = accountFeature;
