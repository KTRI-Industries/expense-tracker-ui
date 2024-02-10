import { TransactionsEntity } from './transactions.models';
import {
  initialTransactionsState,
  transactionsAdapter,
  TransactionsPartialState,
} from './transactions.reducer';
import * as TransactionsSelectors from './transactions.selectors';

describe('Transactions Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getTransactionsId = (it: TransactionsEntity) => it.id;
  const createTransactionsEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    }) as TransactionsEntity;

  let state: TransactionsPartialState;

  beforeEach(() => {
    state = {
      transactions: transactionsAdapter.setAll(
        [
          createTransactionsEntity('PRODUCT-AAA'),
          createTransactionsEntity('PRODUCT-BBB'),
          createTransactionsEntity('PRODUCT-CCC'),
        ],
        {
          ...initialTransactionsState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        },
      ),
    };
  });

  describe('Transactions Selectors', () => {
    it('selectAllTransactions() should return the list of Transactions', () => {
      const results = TransactionsSelectors.selectAllTransactions(state);
      const selId = getTransactionsId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectEntity() should return the selected Entity', () => {
      const result = TransactionsSelectors.selectEntity(
        state,
      ) as TransactionsEntity;
      const selId = getTransactionsId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('selectTransactionsLoaded() should return the current "loaded" status', () => {
      const result = TransactionsSelectors.selectTransactionsLoaded(state);

      expect(result).toBe(true);
    });

    it('selectTransactionsError() should return the current "error" state', () => {
      const result = TransactionsSelectors.selectTransactionsError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
