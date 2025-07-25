import {
  initialRecurrentTransactionsState,
  recurrentTransactionsFeature,
  RecurrentTransactionsState,
} from './recurrent-transactions.reducer';
import { RecurrentTransactionActions } from './transactions.actions';
import {
  PageRecurrentTransactionDto,
  RecurrentTransactionDto,
  RecurrenceFrequency,
} from '@expense-tracker-ui/shared/api';

describe('RecurrentTransactions Reducer', () => {
  let state: RecurrentTransactionsState;

  beforeEach(() => {
    state = { ...initialRecurrentTransactionsState };
  });

  it('should return the initial state', () => {
    const action = { type: 'NOOP' };
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result).toBe(state);
  });

  it('should load recurrent transactions successfully', () => {
    const recurrentTransactions: PageRecurrentTransactionDto = {
      content: [],
      totalElements: 0,
    };
    const action = RecurrentTransactionActions.loadRecurrentTransactionsSuccess({
      recurrentTransactions
    });
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result.recurrentTransactions).toEqual(recurrentTransactions);
  });

  it('should handle openRecurrentTransactionFrom action', () => {
    const initialStateWithSelectedId: RecurrentTransactionsState = {
      ...state,
      selectedTransactionId: 'some-id',
    };
    const action = RecurrentTransactionActions.openRecurrentTransactionFrom();
    const result = recurrentTransactionsFeature.reducer(initialStateWithSelectedId, action);

    expect(result.selectedTransactionId).toBeNull();
  });

  it('should handle createNewRecurrentTransactionSuccess action', () => {
    const mockRecurrentTransaction: RecurrentTransactionDto = {
      recurrentTransactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      recurrencePeriod: {
        startDate: '2025-01-01',
        frequency: RecurrenceFrequency.Monthly,
      },
      description: 'Monthly rent',
      tenantId: '1',
      userId: '1',
    };

    const initialStateWithTransactions: RecurrentTransactionsState = {
      ...state,
      recurrentTransactions: {
        content: [mockRecurrentTransaction],
        totalElements: 1,
      },
    };

    const action = RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
      recurrentTransaction: mockRecurrentTransaction,
    });
    const result = recurrentTransactionsFeature.reducer(initialStateWithTransactions, action);

    expect(result.recurrentTransactions).toBeUndefined();
  });

  it('should handle editRecurrentTransaction action', () => {
    const recurrentTransactionId = 'recurrent-tx-1';
    const action = RecurrentTransactionActions.editRecurrentTransaction({
      recurrentTransactionId
    });
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result.selectedTransactionId).toEqual(recurrentTransactionId);
  });

  it('should handle loadRecurrentTransaction action', () => {
    const recurrentTransactionId = 'recurrent-tx-1';
    const action = RecurrentTransactionActions.loadRecurrentTransaction({
      recurrentTransactionId
    });
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result.selectedTransactionId).toEqual(recurrentTransactionId);
  });

  it('should handle loadRecurrentTransactionSuccess action', () => {
    const mockRecurrentTransaction: RecurrentTransactionDto = {
      recurrentTransactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 150,
      },
      recurrencePeriod: {
        startDate: '2025-01-01',
        frequency: RecurrenceFrequency.Daily,
      },
      description: 'Daily groceries',
      tenantId: '1',
      userId: '1',
    };

    const action = RecurrentTransactionActions.loadRecurrentTransactionSuccess({
      recurrentTransaction: mockRecurrentTransaction,
    });
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result.recurrentTransactions).toEqual({
      content: [mockRecurrentTransaction],
    });
  });

  it('should load recurrent transaction when content already contains transactions', () => {
    const existingTransaction: RecurrentTransactionDto = {
      recurrentTransactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      recurrencePeriod: {
        startDate: '2025-01-01',
        frequency: RecurrenceFrequency.Monthly,
      },
      description: 'Monthly rent',
      tenantId: '1',
      userId: '1',
    };

    const newTransaction: RecurrentTransactionDto = {
      recurrentTransactionId: '2',
      amount: {
        currency: 'EUR',
        amount: 200,
      },
      recurrencePeriod: {
        startDate: '2025-01-15',
        frequency: RecurrenceFrequency.Yearly,
      },
      description: 'Yearly insurance',
      tenantId: '1',
      userId: '1',
    };

    const mockState: RecurrentTransactionsState = {
      recurrentTransactions: {
        content: [existingTransaction],
        totalElements: 1,
      },
      selectedTransactionId: null,
    };

    const action = RecurrentTransactionActions.loadRecurrentTransactionSuccess({
      recurrentTransaction: newTransaction,
    });
    const result = recurrentTransactionsFeature.reducer(mockState, action);

    expect(result.recurrentTransactions).toEqual({
      content: [existingTransaction, newTransaction],
      totalElements: 1,
    });
  });

  it('should handle loadRecurrentTransactionSuccess when recurrentTransactions is undefined', () => {
    const mockRecurrentTransaction: RecurrentTransactionDto = {
      recurrentTransactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 75,
      },
      recurrencePeriod: {
        startDate: '2025-01-01',
        frequency: RecurrenceFrequency.Daily,
      },
      description: 'Daily coffee',
      tenantId: '1',
      userId: '1',
    };

    const action = RecurrentTransactionActions.loadRecurrentTransactionSuccess({
      recurrentTransaction: mockRecurrentTransaction,
    });
    const result = recurrentTransactionsFeature.reducer(state, action);

    expect(result.recurrentTransactions).toEqual({
      content: [mockRecurrentTransaction],
    });
  });
});
