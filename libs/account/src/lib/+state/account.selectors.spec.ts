import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { selectCurrentAccountOwnerEmail } from './account.selectors';

describe('AccountSelectors', () => {
  it('should return the currentAccountOwnerEmail if the accounts and currentAccount are defined', () => {
    const accounts: TenantWithUserDetails[] = [
      {
        id: 'tenant-123',
        isDefault: true,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
      {
        id: 'tenant-456',
        isDefault: false,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
    ];
    const currentAccount = 'tenant-123';

    const currentAccountOwnerEmail = selectCurrentAccountOwnerEmail.projector(
      accounts,
      currentAccount,
    );

    expect(currentAccountOwnerEmail).toEqual('main@example.com');
  });

  it('should return undefined currentAccountOwnerEmail if no accounts', () => {
    const currentAccountOwnerEmail = selectCurrentAccountOwnerEmail.projector(
      [],
      '',
    );

    expect(currentAccountOwnerEmail).toBeUndefined();
  });

  it('should return undefined currentAccountOwnerEmail if the currentAccount is empty', () => {
    const accounts: TenantWithUserDetails[] = [
      {
        id: 'tenant-123',
        isDefault: true,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
      {
        id: 'tenant-456',
        isDefault: false,
        mainUserEmail: 'main@example.com',
        isAssociated: true,
        isCurrentUserOwner: true,
      },
    ];

    const currentAccountOwnerEmail = selectCurrentAccountOwnerEmail.projector(
      accounts,
      '',
    );

    expect(currentAccountOwnerEmail).toBeUndefined();
  });
});
