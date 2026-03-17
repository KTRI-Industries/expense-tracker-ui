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

  it('should display username initials in avatar if authenticated', async () => {
    component = await setupComponent(true, 'JohnDoe', '1234');

    // Avatar button should be present
    expect(screen.getAllByRole('button', { name: /user menu/i }).length).toBeGreaterThanOrEqual(1);
    // Initials derived from 'JohnDoe' → 'JO'
    expect(screen.getAllByText('JO').length).toBeGreaterThanOrEqual(1);
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

  it('should emit logout event when "Sign out" menu item is clicked', async () => {
    component = await setupComponent(true, null, '1234');
    const logoutSpy = jest.spyOn(
      component.fixture.componentInstance,
      'onLogout',
    );

    // Open the user menu first
    fireEvent.click(screen.getAllByRole('button', { name: /user menu/i })[0]);
    component.fixture.detectChanges();

    fireEvent.click(screen.getByText('Sign out'));

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should emit manageSecurity event when "Security" menu item is clicked', async () => {
    component = await setupComponent(true, null, '1234');
    const manageSecuritySpy = jest.spyOn(
      component.fixture.componentInstance,
      'onManageSecurity',
    );

    // Open the user menu first
    fireEvent.click(screen.getAllByRole('button', { name: /user menu/i })[0]);
    component.fixture.detectChanges();

    fireEvent.click(screen.getByText('Security'));

    expect(manageSecuritySpy).toHaveBeenCalled();
  });

  it('should show user avatar button when authenticated with tenantId', async () => {
    component = await setupComponent(true, 'atrifyllis', '1234');

    expect(screen.getAllByRole('button', { name: /user menu/i })[0]).toBeInTheDocument();
    expect(screen.getAllByText('AT').length).toBeGreaterThanOrEqual(1);
  });

  it('should compute initials correctly', () => {
    const instance = new NavMenuComponent();
    instance.username = 'atrifyllis';
    expect(instance.initials).toBe('AT');

    instance.username = 'J';
    expect(instance.initials).toBe('J');

    instance.username = null;
    expect(instance.initials).toBe('');
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
