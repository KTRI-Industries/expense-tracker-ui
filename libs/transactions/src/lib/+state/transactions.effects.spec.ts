import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action, ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import moment from 'moment';
import {
  Category,
  MonetaryAmount,
  PageTransactionDto,
  Pageable,
  TransactionDto,
} from '@expense-tracker-ui/shared/api';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';
import { TransactionsEffects } from './transactions.effects';
import { TransactionsService } from '../transactions.service';
import { TransactionActions } from './transactions.actions';
import { selectTransactions } from './transactions.selectors';

describe('TransactionsEffects', () => {
  let actions$: ActionsSubject;
  let transactions$: BehaviorSubject<PageTransactionDto | undefined>;
  let effects: TransactionsEffects;
  let service: jest.Mocked<
    Pick<
      TransactionsService,
      | 'getAllTransactions'
      | 'getTransaction'
      | 'createTransaction'
      | 'deleteTransaction'
      | 'updateTransaction'
      | 'importTransactions'
    >
  >;
  let router: jest.Mocked<Pick<Router, 'navigate'>>;
  let snackBar: jest.Mocked<Pick<MatSnackBar, 'open'>>;
  let store: Pick<Store, 'select'>;
  let subscriptions: Subscription[];

  const createMonetaryAmount = (
    amount: number,
    currency = 'EUR',
  ): MonetaryAmount => ({
    amount,
    currency,
  });

  const createTransaction = (
    overrides: Partial<TransactionDto> = {},
  ): TransactionDto => ({
    transactionId: 'transaction-1',
    amount: createMonetaryAmount(-100),
    date: '2025-01-01',
    description: 'Groceries',
    tenantId: 'tenant-1',
    categories: [Category.Groceries],
    ...overrides,
  });

  const createTransactionPage = (
    content: TransactionDto[] = [createTransaction()],
  ): PageTransactionDto => ({
    content,
    totalElements: content.length,
    totalPages: 1,
    size: 10,
    number: 0,
  });

  beforeEach(() => {
    actions$ = new ActionsSubject();
    transactions$ = new BehaviorSubject<PageTransactionDto | undefined>(
      undefined,
    );
    subscriptions = [];
    service = {
      getAllTransactions: jest.fn(),
      getTransaction: jest.fn(),
      createTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
      updateTransaction: jest.fn(),
      importTransactions: jest.fn(),
    };
    router = {
      navigate: jest.fn(),
    };
    snackBar = {
      open: jest.fn(),
    };
    store = {
      select: jest.fn((selector) => {
        if (selector === selectTransactions) {
          return transactions$.asObservable();
        }

        return of(undefined);
      }),
    };

    effects = new TransactionsEffects(
      router as unknown as Router,
      snackBar as unknown as MatSnackBar,
      store as Store,
      actions$ as unknown as Actions,
      service as unknown as TransactionsService,
    );
  });

  afterEach(() => {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    actions$.complete();
    transactions$.complete();
  });

  function collect(effect$: Observable<Action>) {
    const emittedActions: Action[] = [];
    subscriptions.push(effect$.subscribe((action) => emittedActions.push(action)));

    return emittedActions;
  }

  it('loads transactions with the formatted filter range', () => {
    const transactions = createTransactionPage();
    const pageable: Pageable = { page: 0, size: 10 };
    service.getAllTransactions.mockReturnValue(of(transactions));
    const emittedActions = collect(effects.retrieveTransactions$);

    actions$.next(
      TransactionActions.initTransactions({
        pageable,
        filterRange: {
          startDate: moment('2025-07-01'),
          endDate: moment('2025-07-15'),
          dateRange: 'custom',
        },
      }),
    );

    expect(service.getAllTransactions).toHaveBeenCalledWith(
      pageable,
      '2025-07-01T00:00:00',
      '2025-07-15T00:00:00',
    );
    expect(emittedActions).toEqual([
      TransactionActions.loadTransactionsSuccess({ transactions }),
    ]);
  });

  it('dispatches loadTransactionsFailure when loading transactions fails', () => {
    const error = new Error('Error loading transactions');
    service.getAllTransactions.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.retrieveTransactions$);

    actions$.next(
      TransactionActions.initTransactions({
        pageable: { page: 0, size: 10 },
      }),
    );

    expect(emittedActions).toEqual([
      TransactionActions.loadTransactionsFailure({ error }),
    ]);
  });

  it('loads a single transaction when it is not already present in state', () => {
    const transaction = createTransaction({ transactionId: 'transaction-1' });
    transactions$.next(
      createTransactionPage([
        createTransaction({ transactionId: 'transaction-2' }),
      ]),
    );
    service.getTransaction.mockReturnValue(of(transaction));
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      TransactionActions.loadTransaction({ transactionId: 'transaction-1' }),
    );

    expect(service.getTransaction).toHaveBeenCalledWith('transaction-1');
    expect(emittedActions).toEqual([
      TransactionActions.loadTransactionSuccess({ transaction }),
    ]);
  });

  it('does not reload a transaction that is already present in state', () => {
    transactions$.next(
      createTransactionPage([
        createTransaction({ transactionId: 'transaction-1' }),
      ]),
    );
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      TransactionActions.loadTransaction({ transactionId: 'transaction-1' }),
    );

    expect(service.getTransaction).not.toHaveBeenCalled();
    expect(emittedActions).toEqual([]);
  });

  it('dispatches loadTransactionFailure when loading a single transaction fails', () => {
    const error = new Error('Error loading transaction');
    service.getTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      TransactionActions.loadTransaction({ transactionId: 'transaction-1' }),
    );

    expect(emittedActions).toEqual([
      TransactionActions.loadTransactionFailure({ error }),
    ]);
  });

  it('creates a transaction and performs the success side effects', () => {
    const createdTransaction = createTransaction();
    const transaction = {
      amount: createMonetaryAmount(100),
      date: '2025-01-01',
      description: 'Salary',
    };
    service.createTransaction.mockReturnValue(of(createdTransaction));
    const emittedActions = collect(effects.createTransaction$);

    actions$.next(TransactionActions.createNewTransaction({ transaction }));

    expect(service.createTransaction).toHaveBeenCalledWith(transaction);
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction created', 'Close');
    expect(emittedActions).toEqual([
      TransactionActions.createNewTransactionSuccess({
        transaction: createdTransaction,
      }),
    ]);
  });

  it('dispatches createNewTransactionFailure when creation fails', () => {
    const error = new Error('Error creating transaction');
    service.createTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.createTransaction$);

    actions$.next(
      TransactionActions.createNewTransaction({
        transaction: {
          amount: createMonetaryAmount(100),
          date: '2025-01-01',
        },
      }),
    );

    expect(router.navigate).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
    expect(emittedActions).toEqual([
      TransactionActions.createNewTransactionFailure({ error }),
    ]);
  });

  it('navigates to the create transaction form', () => {
    subscriptions.push(effects.openTransactionForm$.subscribe());

    actions$.next(TransactionActions.openTransactionFrom());

    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
      'new',
    ]);
  });

  it('navigates to the edit transaction form', () => {
    subscriptions.push(effects.openTransactionFormToEdit$.subscribe());

    actions$.next(
      TransactionActions.editTransaction({ transactionId: 'transaction-1' }),
    );

    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
      'transaction-1',
    ]);
  });

  it('deletes a transaction and performs the success side effects', () => {
    service.deleteTransaction.mockReturnValue(of(undefined));
    const emittedActions = collect(effects.deleteTransaction$);

    actions$.next(
      TransactionActions.deleteTransaction({ transactionId: 'transaction-1' }),
    );

    expect(service.deleteTransaction).toHaveBeenCalledWith('transaction-1');
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction deleted', 'Close');
    expect(emittedActions).toEqual([
      TransactionActions.deleteTransactionSuccess(),
    ]);
  });

  it('dispatches deleteTransactionFailure when deletion fails', () => {
    const error = new Error('Error deleting transaction');
    service.deleteTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.deleteTransaction$);

    actions$.next(
      TransactionActions.deleteTransaction({ transactionId: 'transaction-1' }),
    );

    expect(emittedActions).toEqual([
      TransactionActions.deleteTransactionFailure({ error }),
    ]);
  });

  it('updates a transaction and performs the success side effects', () => {
    const updatedTransaction = createTransaction();
    service.updateTransaction.mockReturnValue(of(updatedTransaction));
    const emittedActions = collect(effects.updateTransaction$);

    actions$.next(
      TransactionActions.updateTransaction({ transaction: updatedTransaction }),
    );

    expect(service.updateTransaction).toHaveBeenCalledWith(updatedTransaction);
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction updated', 'Close');
    expect(emittedActions).toEqual([
      TransactionActions.updateTransactionSuccess({
        transaction: updatedTransaction,
      }),
    ]);
  });

  it('dispatches updateTransactionFailure when updating fails', () => {
    const error = new Error('Error updating transaction');
    service.updateTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.updateTransaction$);

    actions$.next(
      TransactionActions.updateTransaction({
        transaction: createTransaction(),
      }),
    );

    expect(emittedActions).toEqual([
      TransactionActions.updateTransactionFailure({ error }),
    ]);
  });

  it('navigates to the import transactions form', () => {
    subscriptions.push(effects.openImportTransactionsForm$.subscribe());

    actions$.next(TransactionActions.openImportTransactionsFrom());

    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'import-transactions',
    ]);
  });

  it('imports transactions and performs the success side effects', () => {
    const file = new File(
      ['date,amount,description\n2025-01-01,100,Salary'],
      'transactions.csv',
      { type: 'text/csv' },
    );
    service.importTransactions.mockReturnValue(of('Import completed'));
    const emittedActions = collect(effects.importTransactions$);

    actions$.next(TransactionActions.importTransactions({ fileContent: file }));

    expect(service.importTransactions).toHaveBeenCalledWith(file);
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transactions imported', 'Close');
    expect(emittedActions).toEqual([
      TransactionActions.importTransactionsSuccess(),
    ]);
  });

  it('dispatches importTransactionsFailure when import fails', () => {
    const error = new Error('Error importing transactions');
    const file = new File(['invalid,csv'], 'transactions.csv', {
      type: 'text/csv',
    });
    service.importTransactions.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.importTransactions$);

    actions$.next(TransactionActions.importTransactions({ fileContent: file }));

    expect(emittedActions).toEqual([
      TransactionActions.importTransactionsFailure({ error }),
    ]);
  });

  it.each([
    TransactionActions.createNewTransactionSuccess({
      transaction: createTransaction(),
    }),
    TransactionActions.updateTransactionSuccess({
      transaction: createTransaction(),
    }),
    TransactionActions.deleteTransactionSuccess(),
  ])('clears backend errors after a successful mutation: %o', (action) => {
    const emittedActions = collect(effects.clearError$);

    actions$.next(action);

    expect(emittedActions).toEqual([ErrorHandlingActions.clearBackEndError()]);
  });
});
