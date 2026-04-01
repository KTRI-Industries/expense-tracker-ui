import { FeatureFlagsResponse } from '@expense-tracker-ui/shared/api';
import { selectImportTransactionsEnabled } from './feature-flags.selectors';

describe('FeatureFlagSelectors', () => {
  it('selectImportTransactionsEnabled should return the flag value', () => {
    expect(
      selectImportTransactionsEnabled.projector({
        importTransactions: true,
      }),
    ).toBe(true);
  });

  it('selectImportTransactionsEnabled should default to false', () => {
    const flags: FeatureFlagsResponse = {
      importTransactions: false,
    };

    expect(selectImportTransactionsEnabled.projector(flags)).toBe(false);
  });
});
