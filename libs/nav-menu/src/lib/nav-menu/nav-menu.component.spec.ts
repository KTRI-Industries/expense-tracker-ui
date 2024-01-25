import { NavMenuComponent } from './nav-menu.component';
import { render, RenderResult, screen } from '@testing-library/angular';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('NavMenuComponent', () => {
  let component: RenderResult<NavMenuComponent>;

  it('should create NavMenuComponent', async () => {
    component = await render(NavMenuComponent, {
      imports: [], // Import necessary modules here
      providers: [], // Provide any necessary dependencies here
    });

    expect(component.fixture.componentInstance).toBeTruthy();
  });

  it('should display username if authenticated', async () => {
    component = await setupComponent(true, 'JohnDoe');

    expect(screen.getAllByText('JohnDoe')).toHaveLength(2);
  });

  it('should display "Login" button if not authenticated', async () => {
    component = await setupComponent(false, null);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('should emit login event when "Login" button is clicked', async () => {
    component = await setupComponent(false, null);
    const loginSpy = jest.spyOn(component.fixture.componentInstance, 'onLogin');

    fireEvent.click(screen.getAllByText('login')[0]); // two buttons with same text because of sidenav

    expect(loginSpy).toHaveBeenCalled();
  });

  it('should display "Logout" button if authenticated', async () => {
    component = await setupComponent(true, null);

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should emit logout event when "Logout" button is clicked', async () => {
    component = await setupComponent(true, null);
    const logoutSpy = jest.spyOn(
      component.fixture.componentInstance,
      'onLogout',
    );

    fireEvent.click(screen.getAllByText('logout')[0]);

    expect(logoutSpy).toHaveBeenCalled();
  });
});

async function setupComponent(
  isAuthenticated: boolean,
  username: string | null,
) {
  return await render(NavMenuComponent, {
    imports: [], // Import necessary modules here
    providers: [], // Provide any necessary dependencies here
    componentProperties: {
      isAuthenticated,
      username,
    },
  });
}
