import { authFeature } from './auth.reducer';

export const {
  selectUserProfile,
  selectTenantUsers,
  selectIsLoggedIn,
  selectUserName,
  selectIsTenantOwner,
  selectNonMainUsers,
  selectUserEmail,
  selectTenantId,
  selectCurrentTenant,
  selectTenants,
  selectCurrentTenantOwnerEmail,
  selectPendingInvitations,
} = authFeature;
