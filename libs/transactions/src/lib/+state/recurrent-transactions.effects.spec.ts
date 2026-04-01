import { Actions } from '@ngrx/effects';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Action, ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import {
  Category,
  CreateRecurrentTransactionCommand,
  MonetaryAmount,
  PageRecurrentTransactionDto,
  Pageable,
  RecurrentTransactionDto,
  RecurrenceFrequency,
  UpdateRecurrentTransactionCommand,
} from '@expense-tracker-ui/shared/api';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';
import { RecurrentTransactionsEffects } from './recurrent-transactions.effects';
import { TransactionsService } from '../transactions.service';
import { RecurrentTransactionActions } from './transactions.actions';
import { selectRecurrentTransactions } from './recurrent-transactions.selectors';

describe('RecurrentTransactionsEffects', () => {
  let actions$: ActionsSubject;
  let recurrentTransactions$: BehaviorSubject<
    PageRecurrentTransactionDto | undefined
  >;
  let effects: RecurrentTransactionsEffects;
  let service: jest.Mocked<
    Pick<
      TransactionsService,
      | 'getAllRecurrentTransactions'
      | 'getRecurrentTransaction'
      | 'createRecurrentTransaction'
      | 'updateRecurrentTransaction'
      | 'deleteRecurrentTransaction'
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

  const createRecurrentTransaction = (
    overrides: Partial<RecurrentTransactionDto> = {},
  ): RecurrentTransactionDto => ({
    recurrentTransactionId: 'recurrent-1',
    tenantId: 'tenant-1',
    description: 'Test recurrent transaction',
    categories: [Category.Groceries],
    userId: 'user-1',
    amount: createMonetaryAmount(100),
    recurrencePeriod: {
      startDate: '2025-01-01',
      frequency: RecurrenceFrequency.Monthly,
    },
    ...overrides,
  });

  const createRecurrentTransactionPage = (
    content: RecurrentTransactionDto[] = [createRecurrentTransaction()],
  ): PageRecurrentTransactionDto => ({
    content,
    totalElements: content.length,
    totalPages: 1,
    size: 10,
    number: 0,
  });

  beforeEach(() => {
    actions$ = new ActionsSubject();
    recurrentTransactions$ = new BehaviorSubject<
      PageRecurrentTransactionDto | undefined
    >(undefined);
    subscriptions = [];
    service = {
      getAllRecurrentTransactions: jest.fn(),
      getRecurrentTransaction: jest.fn(),
      createRecurrentTransaction: jest.fn(),
      updateRecurrentTransaction: jest.fn(),
      deleteRecurrentTransaction: jest.fn(),
    };
    router = {
      navigate: jest.fn(),
    };
    snackBar = {
      open: jest.fn(),
    };
    store = {
      select: jest.fn((selector) => {
        if (selector === selectRecurrentTransactions) {
          return recurrentTransactions$.asObservable();
        }

        return of(undefined);
      }),
    };

    effects = new RecurrentTransactionsEffects(
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
    recurrentTransactions$.complete();
  });

  function collect(effect$: Observable<Action>) {
    const emittedActions: Action[] = [];
    subscriptions.push(effect$.subscribe((action) => emittedActions.push(action)));

    return emittedActions;
  }

  it('loads recurrent transactions successfully', () => {
    const pageable: Pageable = { page: 0, size: 10 };
    const recurrentTransactions = createRecurrentTransactionPage();
    service.getAllRecurrentTransactions.mockReturnValue(
      of(recurrentTransactions),
    );
    const emittedActions = collect(effects.retrieveRecurrentTransactions$);

    actions$.next(
      RecurrentTransactionActions.initRecurrentTransactions({ pageable }),
    );

    expect(service.getAllRecurrentTransactions).toHaveBeenCalledWith(pageable);
    expect(emittedActions).toEqual([
      RecurrentTransactionActions.loadRecurrentTransactionsSuccess({
        recurrentTransactions,
      }),
    ]);
  });

  it('dispatches loadRecurrentTransactionsFailure when loading fails', () => {
    const error = new Error('Error loading recurrent transactions');
    service.getAllRecurrentTransactions.mockReturnValue(
      throwError(() => error),
    );
    const emittedActions = collect(effects.retrieveRecurrentTransactions$);

    actions$.next(
      RecurrentTransactionActions.initRecurrentTransactions({
        pageable: { page: 0, size: 10 },
      }),
    );

    expect(emittedActions).toEqual([
      RecurrentTransactionActions.loadRecurrentTransactionsFailure({ error }),
    ]);
  });

  it('loads a recurrent transaction when it is not already present in state', () => {
    const recurrentTransaction = createRecurrentTransaction({
      recurrentTransactionId: 'recurrent-1',
    });
    recurrentTransactions$.next(
      createRecurrentTransactionPage([
        createRecurrentTransaction({ recurrentTransactionId: 'recurrent-2' }),
      ]),
    );
    service.getRecurrentTransaction.mockReturnValue(of(recurrentTransaction));
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      RecurrentTransactionActions.loadRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(service.getRecurrentTransaction).toHaveBeenCalledWith(
      'recurrent-1',
    );
    expect(emittedActions).toEqual([
      RecurrentTransactionActions.loadRecurrentTransactionSuccess({
        recurrentTransaction,
      }),
    ]);
  });

  it('does not reload a recurrent transaction that is already present in state', () => {
    recurrentTransactions$.next(
      createRecurrentTransactionPage([
        createRecurrentTransaction({ recurrentTransactionId: 'recurrent-1' }),
      ]),
    );
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      RecurrentTransactionActions.loadRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(service.getRecurrentTransaction).not.toHaveBeenCalled();
    expect(emittedActions).toEqual([]);
  });

  it('dispatches loadRecurrentTransactionFailure when loading a single recurrent transaction fails', () => {
    const error = new Error('Error loading recurrent transaction');
    service.getRecurrentTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.loadTransaction$);

    actions$.next(
      RecurrentTransactionActions.loadRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(emittedActions).toEqual([
      RecurrentTransactionActions.loadRecurrentTransactionFailure({ error }),
    ]);
  });

  it('creates a recurrent transaction and performs the success side effects', () => {
    const recurrentTransaction = createRecurrentTransaction();
    const recurrentTransactionCommand: CreateRecurrentTransactionCommand = {
      amount: createMonetaryAmount(100),
      description: 'Test recurrent transaction',
      recurrencePeriod: {
        startDate: '2025-01-01',
        frequency: RecurrenceFrequency.Monthly,
      },
      categories: [Category.Groceries],
    };
    service.createRecurrentTransaction.mockReturnValue(of(recurrentTransaction));
    const emittedActions = collect(effects.createTransaction$);

    actions$.next(
      RecurrentTransactionActions.createNewRecurrentTransaction({
        recurrentTransactionCommand,
      }),
    );

    expect(service.createRecurrentTransaction).toHaveBeenCalledWith(
      recurrentTransactionCommand,
    );
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'recurrent-transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Recurrent transaction created',
      'Close',
    );
    expect(emittedActions).toEqual([
      RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
        recurrentTransaction,
      }),
    ]);
  });

  it('dispatches createNewRecurrentTransactionFailure when creation fails', () => {
    const error = new Error('Error creating recurrent transaction');
    service.createRecurrentTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.createTransaction$);

    actions$.next(
      RecurrentTransactionActions.createNewRecurrentTransaction({
        recurrentTransactionCommand: {
          amount: createMonetaryAmount(100),
          description: 'Test recurrent transaction',
          recurrencePeriod: {
            startDate: '2025-01-01',
            frequency: RecurrenceFrequency.Monthly,
          },
          categories: [Category.Groceries],
        },
      }),
    );

    expect(emittedActions).toEqual([
      RecurrentTransactionActions.createNewRecurrentTransactionFailure({
        error,
      }),
    ]);
  });

  it('navigates to the create recurrent transaction form', () => {
    subscriptions.push(effects.openTransactionForm$.subscribe());

    actions$.next(RecurrentTransactionActions.openRecurrentTransactionFrom());

    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'recurrent-transactions',
      'new',
    ]);
  });

  it('navigates to the edit recurrent transaction form', () => {
    subscriptions.push(effects.openTransactionFormToEdit$.subscribe());

    actions$.next(
      RecurrentTransactionActions.editRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'recurrent-transactions',
      'recurrent-1',
    ]);
  });

  it('deletes a recurrent transaction and performs the success side effects', () => {
    service.deleteRecurrentTransaction.mockReturnValue(of(undefined));
    const emittedActions = collect(effects.deleteTransaction$);

    actions$.next(
      RecurrentTransactionActions.deleteRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(service.deleteRecurrentTransaction).toHaveBeenCalledWith(
      'recurrent-1',
    );
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'recurrent-transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Recurrent transaction deleted',
      'Close',
    );
    expect(emittedActions).toEqual([
      RecurrentTransactionActions.deleteRecurrentTransactionSuccess(),
    ]);
  });

  it('dispatches deleteRecurrentTransactionFailure when deletion fails', () => {
    const error = new Error('Error deleting recurrent transaction');
    service.deleteRecurrentTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.deleteTransaction$);

    actions$.next(
      RecurrentTransactionActions.deleteRecurrentTransaction({
        recurrentTransactionId: 'recurrent-1',
      }),
    );

    expect(emittedActions).toEqual([
      RecurrentTransactionActions.deleteRecurrentTransactionFailure({ error }),
    ]);
  });

  it('updates a recurrent transaction and performs the success side effects', () => {
    const recurrentTransaction = createRecurrentTransaction();
    const updateRecurrentTransactionCommand: UpdateRecurrentTransactionCommand =
      {
        recurrentTransactionId: 'recurrent-1',
        amount: createMonetaryAmount(150),
        description: 'Updated recurrent transaction',
        recurrencePeriod: {
          startDate: '2025-01-01',
          frequency: RecurrenceFrequency.Daily,
        },
        categories: [Category.Groceries],
      };
    service.updateRecurrentTransaction.mockReturnValue(of(recurrentTransaction));
    const emittedActions = collect(effects.updateTransaction$);

    actions$.next(
      RecurrentTransactionActions.updateRecurrentTransaction({
        updateRecurrentTransactionCommand,
      }),
    );

    expect(service.updateRecurrentTransaction).toHaveBeenCalledWith(
      updateRecurrentTransactionCommand,
    );
    expect(router.navigate).toHaveBeenCalledWith([
      'transactions-page',
      'recurrent-transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith(
      'Recurrent transaction updated',
      'Close',
    );
    expect(emittedActions).toEqual([
      RecurrentTransactionActions.updateRecurrentTransactionSuccess({
        recurrentTransaction,
      }),
    ]);
  });

  it('dispatches updateRecurrentTransactionFailure when updating fails', () => {
    const error = new Error('Error updating recurrent transaction');
    service.updateRecurrentTransaction.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.updateTransaction$);

    actions$.next(
      RecurrentTransactionActions.updateRecurrentTransaction({
        updateRecurrentTransactionCommand: {
          recurrentTransactionId: 'recurrent-1',
          amount: createMonetaryAmount(150),
          description: 'Updated recurrent transaction',
          recurrencePeriod: {
            startDate: '2025-01-01',
            frequency: RecurrenceFrequency.Daily,
          },
          categories: [Category.Groceries],
        },
      }),
    );

    expect(emittedActions).toEqual([
      RecurrentTransactionActions.updateRecurrentTransactionFailure({ error }),
    ]);
  });

  it.each([
    RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
      recurrentTransaction: createRecurrentTransaction(),
    }),
    RecurrentTransactionActions.updateRecurrentTransactionSuccess({
      recurrentTransaction: createRecurrentTransaction(),
    }),
    RecurrentTransactionActions.deleteRecurrentTransactionSuccess(),
  ])(
    'clears backend errors after a successful recurrent mutation: %o',
    (action) => {
      const emittedActions = collect(effects.clearError$);

      actions$.next(action);

      expect(emittedActions).toEqual([
        ErrorHandlingActions.clearBackEndError(),
      ]);
    },
  );
});
