import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { accountFeature, AccountState } from './account.reducer';
import { AccountActions } from './account.actions';

describe('AccountReducer', () => {
  describe('retrieveAccountsSuccess action', () => {
    it('should set the accounts property and currentAccount if not set', () => {
      const initialState: AccountState = {
        accounts: [],
        currentAccount: '',
      };

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

      const expectedState: AccountState = {
        accounts: accounts,
        currentAccount: 'tenant-123',
      };

      const actualState = accountFeature.reducer(
        initialState,
        AccountActions.retrieveAccountsSuccess({ accounts }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });
  describe('switchAccount action', () => {
    it('should set the currentAccount property', () => {
      const initialState: AccountState = {
        accounts: [],
        currentAccount: '',
      };

      const tenantId = 'tenant-123';
      const expectedState: AccountState = {
        accounts: [],
        currentAccount: tenantId,
      };

      const actualState = accountFeature.reducer(
        initialState,
        AccountActions.switchAccount({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });

  describe('setDefaultAccount action', () => {
    it('should set the currentAccount property', () => {
      const initialState: AccountState = {
        accounts: [],
        currentAccount: '',
      };

      const tenantId = 'tenant-123';
      const expectedState: AccountState = {
        accounts: [],
        currentAccount: tenantId,
      };

      const actualState = accountFeature.reducer(
        initialState,
        AccountActions.setDefaultAccount({ tenantId }),
      );

      expect(actualState).toEqual(expectedState);
    });
  });
});
