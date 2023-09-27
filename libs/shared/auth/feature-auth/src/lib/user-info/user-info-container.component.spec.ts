import { UserInfoContainerComponent } from './user-info-container.component';
import { MockProvider } from 'ng-mocks';
import { render, RenderResult, screen } from '@testing-library/angular';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthSelectors } from '@expense-tracker-ui/shared/auth/data-access';

describe('UserInfoContainerComponent', () => {
  let renderResult: RenderResult<UserInfoContainerComponent>;

  it('should create UserInfoContainerComponent', async () => {
    renderResult = await setup(false, null);

    expect(renderResult.fixture.componentInstance).toBeTruthy();
  });

  it('should display user information when user is logged in', async () => {
    const userProfile: KeycloakProfile = {
      username: 'testuser',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      emailVerified: true,
    };

    renderResult = await setup(true, userProfile);

    expect(screen.getByText(`${userProfile.username}`)).toBeInTheDocument();
    expect(screen.getByText(`${userProfile.firstName}`)).toBeInTheDocument();
    expect(screen.getByText(`${userProfile.lastName}`)).toBeInTheDocument();
    expect(screen.getByText(`${userProfile.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Yes`)).toBeInTheDocument();
  });

  it('should display "Log in" button when not logged in', async () => {
    renderResult = await setup(false, null);

    const loginButton = screen.getByText('Log in');

    expect(loginButton).toBeInTheDocument();
  });

  it('should emit login event when "Log in" button is clicked', async () => {
    renderResult = await setup(false, null);

    const loginSpy = jest.spyOn(
      renderResult.fixture.componentInstance,
      'onLogin'
    );

    const loginButton = screen.getByText('Log in');
    loginButton.click();

    expect(loginSpy).toHaveBeenCalled();
  });

  it('should display "Log out" button when logged in', async () => {
    renderResult = await setup(true, null);

    const logoutButton = screen.getByText('Log out');

    expect(logoutButton).toBeInTheDocument();
  });

  it('should emit logout event when "Log out" button is clicked', async () => {
    renderResult = await setup(true, null);

    const logoutSpy = jest.spyOn(
      renderResult.fixture.componentInstance,
      'onLogout'
    );

    const logoutButton = screen.getByText('Log out');
    logoutButton.click();

    expect(logoutSpy).toHaveBeenCalled();
  });
});

async function setup(isLoggedIn: boolean, userProfile: KeycloakProfile | null) {
  return await render(UserInfoContainerComponent, {
    providers: [
      MockProvider(KeycloakService),
      provideMockStore({
        selectors: [
          {
            selector: AuthSelectors.selectIsLoggedIn,
            value: isLoggedIn,
          },
          { selector: AuthSelectors.selectUserProfile, value: userProfile },
        ],
      }),
    ],
  });
}
