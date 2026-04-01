import '@testing-library/jest-dom';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { NavMenuComponent } from './nav-menu.component';

describe('NavMenuComponent', () => {
  async function setup(
    componentProperties: Partial<NavMenuComponent> = {},
  ) {
    const user = userEvent.setup();

    const renderResult = await render(NavMenuComponent, {
      imports: [NoopAnimationsModule],
      providers: [provideRouter([])],
      componentProperties,
    });

    return { user, ...renderResult };
  }

  it('renders the username as a link to the user page for authenticated users', async () => {
    await setup({
      isAuthenticated: true,
      username: 'atrifyllis',
      tenantId: 'tenant-1',
    });

    const usernameLinks = screen.getAllByRole('link', { name: 'atrifyllis' });

    expect(usernameLinks[0]).toHaveAttribute('href', '/user-page');
  });

  it('renders login buttons when the user is not authenticated', async () => {
    await setup({
      isAuthenticated: false,
      username: null,
    });

    expect(screen.getAllByRole('button', { name: /login/i })).toHaveLength(1);
  });

  it('emits login when a login button is clicked', async () => {
    const { fixture, user } = await setup({
      isAuthenticated: false,
      username: null,
    });
    const loginSpy = jest.spyOn(fixture.componentInstance.login, 'emit');

    await user.click(screen.getAllByRole('button', { name: /login/i })[0]);

    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

  it('emits logout when a logout button is clicked', async () => {
    const { fixture, user } = await setup({
      isAuthenticated: true,
      username: 'JohnDoe',
      tenantId: 'tenant-1',
    });
    const logoutSpy = jest.spyOn(fixture.componentInstance.logout, 'emit');

    await user.click(screen.getAllByRole('button', { name: /logout/i })[0]);

    expect(logoutSpy).toHaveBeenCalledTimes(1);
  });
});
