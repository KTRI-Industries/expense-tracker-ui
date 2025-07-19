import {
  initialTransactionsState,
  transactionsFeature,
  TransactionsState,
} from './transactions.reducer';
import { TransactionActions } from './transactions.actions';
import {
  PageTransactionDto,
  TransactionDto,
} from '@expense-tracker-ui/shared/api';
import { selectAugmentedTransactions } from './transactions.selectors';

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

  it('should handle editTransaction', () => {
    const action = TransactionActions.editTransaction({ transactionId: '1' });
    const result = transactionsFeature.reducer(state, action);

    expect(result.selectedTransactionId).toEqual('1');
  });

  it('should handle loadTransaction', () => {
    const action = TransactionActions.loadTransaction({ transactionId: '1' });
    const result = transactionsFeature.reducer(state, action);

    expect(result.selectedTransactionId).toEqual('1');
  });

  it('should handle loadTransactionSuccess', () => {
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
    const action = TransactionActions.loadTransactionSuccess({
      transaction: mockTransaction,
    });
    const result = transactionsFeature.reducer(state, action);

    expect(result.transactions).toEqual({
      content: [mockTransaction],
    });
  });

  it('should load transaction when content already contains a transaction', () => {
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

    const mockTransaction2: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 200,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };

    const mockState: TransactionsState = {
      transactions: {
        content: [mockTransaction],
      },
      selectedTransactionId: null,
      filterRange: null,
    };

    const action = TransactionActions.loadTransactionSuccess({
      transaction: mockTransaction2,
    });
    const result = transactionsFeature.reducer(mockState, action);

    expect(result.transactions).toEqual({
      content: [mockTransaction, mockTransaction2],
    });
  });

  it('should handle openTransactionFrom', () => {
    const action = TransactionActions.openTransactionFrom();
    const result = transactionsFeature.reducer(state, action);

    expect(result.selectedTransactionId).toBeNull();
  });

  it('should return transactions with user email', () => {
    const tenantUsers = [
      {
        userId: '1',
        username: 'user1',
        email: 'user1@example.com',
        isMainUser: false,
      },
      {
        userId: '2',
        username: 'user2',
        email: 'user2@example.com',
        isMainUser: false,
      },
    ];

    const transactions: PageTransactionDto = {
      content: [
        {
          transactionId: 't1',
          userId: '1',
          amount: { currency: 'EUR', amount: 100 },
          date: '2022-01-01',
          description: 'desc1',
          tenantId: 'tenant1',
        },
        {
          transactionId: 't2',
          userId: '2',
          amount: { currency: 'EUR', amount: 200 },
          date: '2022-01-02',
          description: 'desc2',
          tenantId: 'tenant2',
        },
      ],
    };

    const augmentedTransactions = selectAugmentedTransactions.projector(
      tenantUsers,
      transactions,
    );

    expect(augmentedTransactions).toEqual({
      content: [
        {
          transactionId: 't1',
          userId: '1',
          amount: { currency: 'EUR', amount: 100 },
          date: '2022-01-01',
          description: 'desc1',
          tenantId: 'tenant1',
          email: 'user1@example.com',
        },
        {
          transactionId: 't2',
          userId: '2',
          amount: { currency: 'EUR', amount: 200 },
          date: '2022-01-02',
          description: 'desc2',
          tenantId: 'tenant2',
          email: 'user2@example.com',
        },
      ],
    });
  });
});
