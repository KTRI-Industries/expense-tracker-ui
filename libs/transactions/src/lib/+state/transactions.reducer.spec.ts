import {
  initialTransactionsState,
  transactionsFeature,
  TransactionsState,
} from './transactions.reducer';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';

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
    const transactions: PageTransactionDto = {};
    const action = TransactionActions.loadTransactionsSuccess({ transactions });
    const result = transactionsFeature.reducer(state, action);

    expect(result.transactions).toEqual(transactions);
  });

  it('should handle createNewTransactionSuccess action', () => {
    const mockTransaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    const action = TransactionActions.createNewTransactionSuccess({
      transaction: mockTransaction,
    });
    const result = transactionsFeature.reducer(state, action);

    expect(result.transactions).toBeUndefined();
  });
});
