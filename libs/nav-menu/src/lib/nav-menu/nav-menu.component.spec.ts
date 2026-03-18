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

  it('should display username link if authenticated', async () => {
    component = await setupComponent(true, 'JohnDoe', '1234');

    expect(screen.getAllByText('JohnDoe').length).toBeGreaterThanOrEqual(1);
  });

  it('should display "Login" button if not authenticated', async () => {
    component = await setupComponent(false, null);

    expect(screen.getAllByText('login')[0]).toBeInTheDocument();
  });

  it('should emit login event when "Login" button is clicked', async () => {
    component = await setupComponent(false, null);
    const loginSpy = jest.spyOn(component.fixture.componentInstance, 'onLogin');

    fireEvent.click(screen.getAllByText('login')[0]); // two buttons with same text because of sidenav

    expect(loginSpy).toHaveBeenCalled();
  });

  it('should emit logout event when logout button is clicked', async () => {
    component = await setupComponent(true, null, '1234');
    const logoutSpy = jest.spyOn(
      component.fixture.componentInstance,
      'onLogout',
    );

    const logoutButtons = screen.getAllByRole('button', { name: '' });
    // Find the logout button by data-cy attribute
    const logoutButton = logoutButtons.find(
      (el) => el.getAttribute('data-cy') === 'logout-button',
    );
    fireEvent.click(logoutButton!);

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should display username as link to user page when authenticated', async () => {
    component = await setupComponent(true, 'atrifyllis', '1234');

    const links = screen.getAllByRole('link', { name: 'atrifyllis' });
    expect(links.length).toBeGreaterThanOrEqual(1);
    expect(links[0]).toHaveAttribute('href', '/user-page');
  });
});

async function setupComponent(
  isAuthenticated: boolean,
  username: string | null,
  tenantId?: string,
) {
  return await render(NavMenuComponent, {
    imports: [], // Import necessary modules here
    providers: [], // Provide any necessary dependencies here
    componentProperties: {
      isAuthenticated,
      username,
      tenantId,
    },
  });
}
