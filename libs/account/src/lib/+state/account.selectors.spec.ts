import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import {
  selectCurrentAccountOwnerEmail,
  selectIsUserCurrentAccountOwner,
  selectPendingAccountInvitations,
} from './account.selectors';

describe('AccountSelectors', () => {
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
      isAssociated: false,
      isCurrentUserOwner: false,
    },
  ];

  const state = {
    accounts: accounts,
    currentAccount: 'tenant-123',
  };

  it('selectCurrentAccountOwnerEmail should return the mainUserEmail of the current account', () => {
    const result = selectCurrentAccountOwnerEmail.projector(
      state.accounts,
      state.currentAccount,
    );
    expect(result).toBe('main@example.com');
  });

  it('selectPendingAccountInvitations should return the count of pending invitations', () => {
    const result = selectPendingAccountInvitations.projector(state.accounts);
    expect(result).toBe(1);
  });

  it('selectIsUserCurrentAccountOwner should return true if the user is the owner of the current account', () => {
    const userProfile = {
      email: 'main@example.com',
      userRoles: ['tenant-owner'],
    };

    const result = selectIsUserCurrentAccountOwner.projector(
      userProfile,
      state.currentAccount,
      state.accounts,
    );
    expect(result).toBe(true);
  });

  it('selectIsUserCurrentAccountOwner should return false if the user is not the owner of the current account', () => {
    const userProfile = {
      email: 'other@example.com',
      userRoles: ['tenant-owner'],
    };

    const result = selectIsUserCurrentAccountOwner.projector(
      userProfile,
      state.currentAccount,
      state.accounts,
    );
    expect(result).toBe(false);
  });
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
