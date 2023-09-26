import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';
import { of } from 'rxjs';
import { KeycloakProfile } from 'keycloak-js';

describe('AuthEffects', () => {
  it('should log in user when login action is triggered', () => {
    // Arrange
    const actions$ = of(AuthActions.login());
    const keycloakServiceMock = {
      login: jest.fn(),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);

    // Act
    authEffects.login$.subscribe();

    // Assert
    expect(keycloakServiceMock.login).toHaveBeenCalled();
  });

  it('should log out user and redirect to base url when logout action is triggered', () => {
    // Arrange
    const actions$ = of(AuthActions.logout());
    const keycloakServiceMock = {
      logout: jest.fn(),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);

    // Act
    authEffects.logout$.subscribe();

    // Assert
    expect(keycloakServiceMock.logout).toHaveBeenCalledWith(
      window.location.origin
    );
  });

  it('should retrieve user profile after successful login', () => {
    // Arrange
    const userProfile: KeycloakProfile = {
      id: '123',
      username: 'john_doe',
      email: 'john@example.com',
      // Fill in other properties as needed
    };
    const actions$ = of(AuthActions.loginSuccess());
    const keycloakServiceMock = {
      loadUserProfile: jest.fn().mockResolvedValue(userProfile),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);
    const expectedAction = AuthActions.retrieveUserProfileSuccess({
      userProfile,
    });

    // Act
    authEffects.retrieveProfile$.subscribe((action) => {
      // Assert
      expect(action).toEqual(expectedAction);
    });
  });

  it('should check if user is logged in and dispatch loginSuccess action if true', () => {
    // Arrange
    const actions$ = of(AuthActions.checkLogin());
    const keycloakServiceMock = {
      isLoggedIn: jest.fn().mockResolvedValue(true),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);
    const expectedAction = AuthActions.loginSuccess();

    // Act
    authEffects.checkLogin$.subscribe((action) => {
      // Assert
      expect(action).toEqual(expectedAction);
    });
  });

  it('should dispatch retrieveUserProfileFailure action if profile retrieval fails', () => {
    // Arrange
    const error = new Error('Profile retrieval failed');
    const actions$ = of(AuthActions.loginSuccess());
    const keycloakServiceMock = {
      loadUserProfile: jest.fn().mockRejectedValue(error),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);
    const expectedAction = AuthActions.retrieveUserProfileFailure({
      error: error,
    });

    // Act
    authEffects.retrieveProfile$.subscribe((action) => {
      // Assert
      expect(action).toEqual(expectedAction);
    });
  });

  it('should dispatch loginFailure action if user is not logged in', () => {
    // Arrange
    const error = new Error('User is not logged in');
    const actions$ = of(AuthActions.checkLogin());
    const keycloakServiceMock = {
      isLoggedIn: jest.fn().mockRejectedValue(error),
    };
    const authEffects = new AuthEffects(actions$, keycloakServiceMock as any);
    const expectedAction = AuthActions.checkLoginFailure({ error: error });

    // Act
    authEffects.checkLogin$.subscribe((action) => {
      // Assert
      expect(action).toEqual(expectedAction);
    });
  });
});
