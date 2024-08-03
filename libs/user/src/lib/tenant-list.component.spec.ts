import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/angular';
import { TenantListComponent } from './tenant-list.component';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import '@testing-library/jest-dom';

describe('TenantListComponent', () => {
  let component: RenderResult<TenantListComponent>;

  async function setupComponent(
    tenants: TenantWithUserDetails[],
    currentTenantId: string,
  ) {
    return await render(TenantListComponent, {
      componentProperties: {
        tenants,
        currentTenantId,
      },
    });
  }

  it('should show "main account" chip if user is the owner', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.getByText('main account')).toBeInTheDocument();
  });

  it('should not show "main account" chip if user is not the owner', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.queryByText('main account')).not.toBeInTheDocument();
  });

  it('should show "Leave tenant" button if user is not the owner and is associated', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.getByText('Leave tenant')).toBeInTheDocument();
  });

  it('should not show "Leave tenant" button if user is the owner', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.queryByText('Leave tenant')).not.toBeInTheDocument();
  });

  it('should show "Accept invitation" button if user is not the owner and is not associated', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: false,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.getByText('Accept invitation')).toBeInTheDocument();
  });

  it('should not show "Accept invitation" button if user is the owner', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: false,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.queryByText('Accept invitation')).not.toBeInTheDocument();
  });

  it('should show "Switch to this account" button if currentTenantId is not the same as the tenant id and user is associated', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '2',
    );

    expect(screen.getByText('Switch to this account')).toBeInTheDocument();
  });

  it('should not show "Switch to this account" button if currentTenantId is the same as the tenant id', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(
      screen.queryByText('Switch to this account'),
    ).not.toBeInTheDocument();
  });

  it('should show "Set this account as default" button if tenant is not default and user is associated', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    expect(screen.getByText('Set this account as default')).toBeInTheDocument();
  });

  it('should not show "Set this account as default" button if tenant is default', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: true,
          id: '1',
        },
      ],
      '1',
    );

    expect(
      screen.queryByText('Set this account as default'),
    ).not.toBeInTheDocument();
  });

  it('should emit leaveTenant event when "Leave tenant" button is clicked', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    const leaveTenantSpy = jest.spyOn(
      component.fixture.componentInstance.leaveTenant,
      'emit',
    );

    fireEvent.click(screen.getByText('Leave tenant'));

    expect(leaveTenantSpy).toHaveBeenCalledWith({
      mainUserEmail: 'test@test.com',
      isCurrentUserOwner: false,
      isAssociated: true,
      isDefault: false,
      id: '1',
    });
  });

  it('should emit associateTenant event when "Accept invitation" button is clicked', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: false,
          isAssociated: false,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    const associateTenantSpy = jest.spyOn(
      component.fixture.componentInstance.associateUserWithAccount,
      'emit',
    );

    fireEvent.click(screen.getByText('Accept invitation'));

    expect(associateTenantSpy).toHaveBeenCalledWith({
      mainUserEmail: 'test@test.com',
      isCurrentUserOwner: false,
      isAssociated: false,
      isDefault: false,
      id: '1',
    });
  });

  it('should emit switchTenant event when "Switch to this account" button is clicked', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '2',
    );

    const switchTenantSpy = jest.spyOn(
      component.fixture.componentInstance.switchAccount,
      'emit',
    );

    fireEvent.click(screen.getByText('Switch to this account'));

    expect(switchTenantSpy).toHaveBeenCalledWith({
      mainUserEmail: 'test@test.com',
      isCurrentUserOwner: true,
      isAssociated: true,
      isDefault: false,
      id: '1',
    });
  });

  it('should emit setDefaultTenant event when "Set this account as default" button is clicked', async () => {
    component = await setupComponent(
      [
        {
          mainUserEmail: 'test@test.com',
          isCurrentUserOwner: true,
          isAssociated: true,
          isDefault: false,
          id: '1',
        },
      ],
      '1',
    );

    const setDefaultTenantSpy = jest.spyOn(
      component.fixture.componentInstance.setDefaultAccount,
      'emit',
    );

    fireEvent.click(screen.getByText('Set this account as default'));

    expect(setDefaultTenantSpy).toHaveBeenCalledWith({
      mainUserEmail: 'test@test.com',
      isCurrentUserOwner: true,
      isAssociated: true,
      isDefault: false,
      id: '1',
    });
  });
});
