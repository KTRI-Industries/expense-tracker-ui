import { authFeature, AuthState } from './auth.reducer';
import { AuthActions } from './auth.actions';
import { selectIsLoggedIn } from './auth.selectors';
import { Action } from '@ngrx/store';

describe('AuthReducer', () => {
  describe('initial state', () => {
    it('should return the initial state', () => {
      const expectedState: AuthState = {
        userProfile: null,
      };

      const actualState = authFeature.reducer(undefined, {} as Action);

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('retrieveUserProfileSuccess action', () => {
    it('should set the userProfile property', () => {
      const expectedState: AuthState = {
        userProfile: {
          id: '1234567890',
          username: 'test-user',
          firstName: 'Test',
          lastName: 'User',
        },
      };

      const actualState = authFeature.reducer(
        {
          userProfile: null,
        },
        AuthActions.retrieveUserProfileSuccess({
          keycloakUserProfile: expectedState.userProfile || {},
        }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('AuthSelector', () => {
    let authState: AuthState;

    beforeEach(() => {
      authState = {
        userProfile: null,
      };
    });

    it('should return true if the userProfile is not null', () => {
      authState.userProfile = {
        id: '1234567890',
        username: 'test-user',
        firstName: 'Test',
        lastName: 'User',
      };

      const isLoggedIn = selectIsLoggedIn.projector(authState.userProfile);

      expect(isLoggedIn).toBeTruthy();
    });

    it('should return false if the userProfile is null', () => {
      const isLoggedIn = selectIsLoggedIn.projector(authState.userProfile);

      expect(isLoggedIn).toBeFalsy();
    });
  });
});
