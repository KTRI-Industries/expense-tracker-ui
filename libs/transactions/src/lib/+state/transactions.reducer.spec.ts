import {
  initialTransactionsState,
  transactionsFeature,
  TransactionsState,
} from './transactions.reducer';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto } from '@expense-tracker-ui/api';

describe('Transactions Reducer', () => {
  let state: TransactionsState;

  beforeEach(() => {
    state = { ...initialTransactionsState };
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' };
    const result = transactionsFeature.reducer(state, action);

    expect(result).toBe(state);
  });

  it('should load transactions successfully', () => {
    const transactions: PageTransactionDto = {
      // fill with mock data
    };
    const action = TransactionActions.loadTransactionsSuccess({ transactions });
    const result = transactionsFeature.reducer(state, action);

    expect(result.transactions).toEqual(transactions);
  });
});
