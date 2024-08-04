import { render, RenderResult, screen } from '@testing-library/angular';
import { TenantListContainerComponent } from './tenant-list.container.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AccountActions, AccountSelectors } from '@expense-tracker-ui/account';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { TestBed } from '@angular/core/testing';
import '@testing-library/jest-dom';

describe('TenantListContainerComponent', () => {
  let component: RenderResult<TenantListContainerComponent>;

  const setup = async () => {
    component = await render(TenantListContainerComponent, {
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: AccountSelectors.selectAccounts,
              value: [
                {
                  id: 'tenant-123',
                  isDefault: true,
                  mainUserEmail: 'main@example.com',
                  isAssociated: true,
                  isCurrentUserOwner: true,
                },
              ],
            },
            {
              selector: AccountSelectors.selectCurrentAccount,
              value: 'tenant-123',
            },
          ],
        }),
      ],
    });
    const store = TestBed.inject(MockStore);
    store.dispatch = jest.fn();
    return { dispatchSpy: store.dispatch };
  };

  it('should dispatch retrieveAccounts action on initialization', async () => {
    const { dispatchSpy } = await setup();
    component.fixture.componentInstance.ngOnInit(); // Manually call ngOnInit
    expect(dispatchSpy).toHaveBeenCalledWith(AccountActions.retrieveAccounts());
  });

  it('should dispatch leaveAccount action on leave tenant', async () => {
    const { dispatchSpy } = await setup();
    const tenant: TenantWithUserDetails = {
      id: 'tenant-123',
      isDefault: true,
      mainUserEmail: 'main@example.com',
      isAssociated: true,
      isCurrentUserOwner: true,
    };
    component.fixture.componentInstance.onLeaveTenant(tenant);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountActions.leaveAccount({ tenantId: tenant.id }),
    );
  });

  it('should dispatch associateUserWithAccount action on associate user with account', async () => {
    const { dispatchSpy } = await setup();
    const tenant: TenantWithUserDetails = {
      id: 'tenant-123',
      isDefault: true,
      mainUserEmail: 'main@example.com',
      isAssociated: true,
      isCurrentUserOwner: true,
    };
    component.fixture.componentInstance.onAssociateUserWithAccount(tenant);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountActions.associateUserWithAccount({ tenantId: tenant.id }),
    );
  });

  it('should dispatch switchAccount action on switch account', async () => {
    const { dispatchSpy } = await setup();
    const tenant: TenantWithUserDetails = {
      id: 'tenant-123',
      isDefault: true,
      mainUserEmail: 'main@example.com',
      isAssociated: true,
      isCurrentUserOwner: true,
    };
    component.fixture.componentInstance.onSwitchAccount(tenant);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountActions.switchAccount({ tenantId: tenant.id }),
    );
  });

  it('should dispatch setDefaultAccount action on set default account', async () => {
    const { dispatchSpy } = await setup();
    const tenant: TenantWithUserDetails = {
      id: 'tenant-123',
      isDefault: true,
      mainUserEmail: 'main@example.com',
      isAssociated: true,
      isCurrentUserOwner: true,
    };
    component.fixture.componentInstance.onSetDefaultAccount(tenant);
    expect(dispatchSpy).toHaveBeenCalledWith(
      AccountActions.setDefaultAccount({ tenantId: tenant.id }),
    );
  });

  it('should render tenant list correctly', async () => {
    await setup();

    // Check if the tenant data is rendered correctly
    const ownerCells = screen.getAllByText('main@example.com');
    expect(ownerCells).toHaveLength(1);
  });
});
