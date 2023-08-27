import { authFeature } from './auth.reducer';

export const {
  selectLoaded,
  selectError,
  selectUserProfile,
  selectIsLoggedIn,
} = authFeature;
