import { AuthActions } from './auth.actions';
import { AuthEffects } from './auth.effects';
import { of } from 'rxjs';
import { KeycloakProfile } from 'keycloak-js';
import { KeycloakService } from 'keycloak-angular';

describe('AuthEffects', () => {
  let keycloakService: KeycloakService;
  beforeEach(() => {
    keycloakService = new KeycloakService();
  });

  it('should log in user when login action is triggered', () => {
    // Arrange
    const actions$ = of(AuthActions.login());

    jest.spyOn(keycloakService, 'login');

    const authEffects = new AuthEffects(actions$, keycloakService);

    // Act
    authEffects.login$.subscribe();

    // Assert
    expect(keycloakService.login).toHaveBeenCalled();
  });

  it('should log out user and redirect to base url when logout action is triggered', () => {
    // Arrange
    const actions$ = of(AuthActions.logout());

    jest.spyOn(keycloakService, 'logout');

    const authEffects = new AuthEffects(actions$, keycloakService);

    // Act
    authEffects.logout$.subscribe();

    // Assert
    expect(keycloakService.logout).toHaveBeenCalledWith(window.location.origin);
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

    jest.spyOn(keycloakService, 'loadUserProfile');

    const authEffects = new AuthEffects(actions$, keycloakService);

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

    jest.spyOn(keycloakService, 'isLoggedIn');

    const authEffects = new AuthEffects(actions$, keycloakService);

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

    jest.spyOn(keycloakService, 'loadUserProfile');

    const authEffects = new AuthEffects(actions$, keycloakService);
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

    jest.spyOn(keycloakService, 'isLoggedIn');


    const authEffects = new AuthEffects(actions$, keycloakService);

    const expectedAction = AuthActions.checkLoginFailure({ error: error });

    // Act
    authEffects.checkLogin$.subscribe((action) => {
      // Assert
      expect(action).toEqual(expectedAction);
    });
  });
});
