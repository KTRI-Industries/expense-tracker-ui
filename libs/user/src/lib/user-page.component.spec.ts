import { UserPageComponent } from './user-page.component';
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/angular';
import '@testing-library/jest-dom';

describe('UserPageComponent', () => {
  let component: RenderResult<UserPageComponent>;

  it('should create UserPageComponent', async () => {
    component = await setupComponent(true, [{ email: 'test@example.com' }]);

    expect(component.fixture.componentInstance).toBeTruthy();
  });

  it('should display users when tenantUsers are available and isTenantOwner is true', async () => {
    component = await setupComponent(true, [{ email: 'test@example.com' }]);

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should display "No users found." when no tenantUsers are available', async () => {
    component = await setupComponent(true, []);

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('should emit onDelete event when "Delete" button is clicked and isTenantOwner is true', async () => {
    component = await setupComponent(true, [{ email: 'test@example.com' }]);
    const deleteSpy = jest.spyOn(component.fixture.componentInstance, 'onDelete');

    const option = screen.getByText('test@example.com');
    fireEvent.click(option);

    const button = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(button);

    expect(deleteSpy).toHaveBeenCalledWith('test@example.com');
  });

  it('should not display "Delete" button when isTenantOwner is false', async () => {
    component = await setupComponent(false, [{ email: 'test@example.com' }]);

    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});

async function setupComponent(isTenantOwner: boolean, tenantUsers: any[]) {
  return await render(UserPageComponent, {
    componentProperties: {
      isTenantOwner,
      tenantUsers,
    },
  });
}
