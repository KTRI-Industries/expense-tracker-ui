import { authFeature } from './auth.reducer';

export const {
  selectUserProfile,
  selectTenantUsers,
  selectIsLoggedIn,
  selectUserName,
  selectIsMainUser,
} = authFeature;
