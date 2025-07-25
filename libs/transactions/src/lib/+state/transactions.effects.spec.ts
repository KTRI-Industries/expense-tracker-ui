import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TransactionsEffects } from './transactions.effects';
import { TransactionsService } from '../transactions.service';
import { TransactionActions } from './transactions.actions';
import {
  Pageable,
  PageTransactionDto,
  TransactionDto,
} from '@expense-tracker-ui/shared/api';
import { cold, hot } from 'jasmine-marbles';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideMockStore } from '@ngrx/store/testing';

const TRANSACTIONS_PAGE_ROUTE = 'transactions-page';

describe('TransactionsEffects', () => {
  let actions$: Observable<Action>;
  let effects: TransactionsEffects;
  let service: TransactionsService;
  let router: Router;
  let snackBar: MatSnackBar;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: TransactionsService,
          useValue: {
            getAllTransactions: jest.fn(),
            createTransaction: jest.fn(),
            deleteTransaction: jest.fn(),
            updateTransaction: jest.fn(),
            importTransactions: jest.fn(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate: jest.fn(),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(TransactionsEffects);
    service = TestBed.inject(TransactionsService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should load transactions successfully', () => {
    const transactions: PageTransactionDto = {
      // fill with mock data
    };
    jest.spyOn(service, 'getAllTransactions').mockReturnValue(of(transactions));
    const action = TransactionActions.initTransactions({
      pageable: {} as Pageable,
    });
    const completion = TransactionActions.loadTransactionsSuccess({
      transactions,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.retrieveTransactions$).toBeObservable(expected);
  });

  it('should handle errors when loading transactions', () => {
    const error = new Error('Error loading transactions');
    jest
      .spyOn(service, 'getAllTransactions')
      .mockReturnValue(throwError(error));
    const action = TransactionActions.initTransactions({
      pageable: {} as Pageable,
    });
    const completion = TransactionActions.loadTransactionsFailure({ error });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.retrieveTransactions$).toBeObservable(expected);
  });

  it('should create a transaction successfully', () => {
    const mockTransaction = {
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
    };
    const mockResponse: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    jest.spyOn(service, 'createTransaction').mockReturnValue(of(mockResponse));
    jest.spyOn(router, 'navigate');
    jest.spyOn(snackBar, 'open');

    actions$ = of(
      TransactionActions.createNewTransaction({ transaction: mockTransaction }),
    );

    effects.createTransaction$.subscribe();

    expect(service.createTransaction).toHaveBeenCalledWith(mockTransaction);
    expect(router.navigate).toHaveBeenCalledWith([
      TRANSACTIONS_PAGE_ROUTE,
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction created', 'Close');
  });

  it('should open the transaction form', () => {
    jest.spyOn(router, 'navigate');

    actions$ = of(TransactionActions.openTransactionFrom());

    effects.openTransactionForm$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith([
      TRANSACTIONS_PAGE_ROUTE,
      'transactions',
      'new',
    ]);
  });

  it('should open the transaction form to edit', () => {
    jest.spyOn(router, 'navigate');

    actions$ = of(TransactionActions.editTransaction({ transactionId: '1' }));

    effects.openTransactionFormToEdit$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith([
      TRANSACTIONS_PAGE_ROUTE,
      'transactions',
      '1',
    ]);
  });

  it('should delete a transaction successfully', () => {
    const transactionId = '1';
    jest.spyOn(service, 'deleteTransaction').mockReturnValue(of(null));
    jest.spyOn(router, 'navigate');

    actions$ = of(TransactionActions.deleteTransaction({ transactionId }));

    effects.deleteTransaction$.subscribe();

    expect(service.deleteTransaction).toHaveBeenCalledWith(transactionId);
    expect(router.navigate).toHaveBeenCalledWith([
      TRANSACTIONS_PAGE_ROUTE,
      'transactions',
    ]);
  });

  it('should handle errors when deleting a transaction', () => {
    const error = new Error('Error deleting transaction');
    jest
      .spyOn(service, 'deleteTransaction')
      .mockReturnValue(throwError(() => error));
    const transactionId = '1';
    const action = TransactionActions.deleteTransaction({ transactionId });
    const completion = TransactionActions.deleteTransactionFailure({ error });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.deleteTransaction$).toBeObservable(expected);
  });

  it('should handle errors when creating a transaction', () => {
    const error = new Error('Error creating transaction');
    jest
      .spyOn(service, 'createTransaction')
      .mockReturnValue(throwError(() => error));
    const mockTransaction = {
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
    };
    const action = TransactionActions.createNewTransaction({
      transaction: mockTransaction,
    });
    const completion = TransactionActions.createNewTransactionFailure({
      error,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.createTransaction$).toBeObservable(expected);
  });

  it('should update a transaction successfully', () => {
    const mockTransaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Updated transaction',
      tenantId: '1',
    };
    jest.spyOn(service, 'updateTransaction').mockReturnValue(of(mockTransaction));
    jest.spyOn(router, 'navigate');
    jest.spyOn(snackBar, 'open');

    actions$ = of(
      TransactionActions.updateTransaction({ transaction: mockTransaction }),
    );

    effects.updateTransaction$.subscribe();

    expect(service.updateTransaction).toHaveBeenCalledWith(mockTransaction);
    expect(router.navigate).toHaveBeenCalledWith([
      TRANSACTIONS_PAGE_ROUTE,
      'transactions',
    ]);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction updated', 'Close');
  });

  it('should handle errors when updating a transaction', () => {
    const error = new Error('Error updating transaction');
    jest
      .spyOn(service, 'updateTransaction')
      .mockReturnValue(throwError(() => error));
    const mockTransaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Updated transaction',
      tenantId: '1',
    };
    const action = TransactionActions.updateTransaction({
      transaction: mockTransaction,
    });
    const completion = TransactionActions.updateTransactionFailure({ error });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(effects.updateTransaction$).toBeObservable(expected);
  });

  describe('Import Transactions Effects', () => {
    it('should open the import transactions form', () => {
      jest.spyOn(router, 'navigate');

      actions$ = of(TransactionActions.openImportTransactionsFrom());

      effects.openImportTransactionsForm$.subscribe();

      expect(router.navigate).toHaveBeenCalledWith([
        TRANSACTIONS_PAGE_ROUTE,
        'import-transactions',
      ]);
    });

    it('should import transactions successfully', () => {
      const mockFile = new File(['date,amount,description\n2024-01-01,100,Test'], 'test.csv', {
        type: 'text/csv'
      });
      jest.spyOn(service, 'importTransactions').mockReturnValue(of('Import successful'));
      jest.spyOn(router, 'navigate');
      jest.spyOn(snackBar, 'open');

      const action = TransactionActions.importTransactions({ fileContent: mockFile });
      const completion = TransactionActions.importTransactionsSuccess();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.importTransactions$).toBeObservable(expected);

      effects.importTransactions$.subscribe(() => {
        expect(service.importTransactions).toHaveBeenCalledWith(mockFile);
        expect(router.navigate).toHaveBeenCalledWith([
          TRANSACTIONS_PAGE_ROUTE,
          'transactions',
        ]);
        expect(snackBar.open).toHaveBeenCalledWith('Transactions imported', 'Close');
      });
    });

    it('should handle errors when importing transactions', () => {
      const error = new Error('Error importing transactions');
      const mockFile = new File(['invalid,csv,content'], 'invalid.csv', {
        type: 'text/csv'
      });
      jest
        .spyOn(service, 'importTransactions')
        .mockReturnValue(throwError(() => error));

      const action = TransactionActions.importTransactions({ fileContent: mockFile });
      const completion = TransactionActions.importTransactionsFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.importTransactions$).toBeObservable(expected);
    });

    it('should import transactions with file content and trigger side effects', () => {
      const mockFile = new File(['date,amount,description\n2024-01-01,100,Test transaction'], 'transactions.csv', {
        type: 'text/csv'
      });
      jest.spyOn(service, 'importTransactions').mockReturnValue(of('Import completed'));
      jest.spyOn(router, 'navigate');
      jest.spyOn(snackBar, 'open');

      actions$ = of(TransactionActions.importTransactions({ fileContent: mockFile }));

      effects.importTransactions$.subscribe();

      expect(service.importTransactions).toHaveBeenCalledWith(mockFile);
      expect(router.navigate).toHaveBeenCalledWith([
        TRANSACTIONS_PAGE_ROUTE,
        'transactions',
      ]);
      expect(snackBar.open).toHaveBeenCalledWith('Transactions imported', 'Close');
    });

    it('should handle network errors during import', () => {
      const networkError = new Error('Network connection failed');
      const mockFile = new File(['date,amount,description\n2024-01-01,100,Test'], 'test.csv', {
        type: 'text/csv'
      });
      jest
        .spyOn(service, 'importTransactions')
        .mockReturnValue(throwError(() => networkError));

      const action = TransactionActions.importTransactions({ fileContent: mockFile });
      const completion = TransactionActions.importTransactionsFailure({ error: networkError });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.importTransactions$).toBeObservable(expected);
    });

    it('should handle validation errors during import', () => {
      const validationError = new Error('Invalid CSV format');
      const invalidFile = new File(['invalid;format;here'], 'invalid.csv', {
        type: 'text/csv'
      });
      jest
        .spyOn(service, 'importTransactions')
        .mockReturnValue(throwError(() => validationError));

      const action = TransactionActions.importTransactions({ fileContent: invalidFile });
      const completion = TransactionActions.importTransactionsFailure({ error: validationError });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.importTransactions$).toBeObservable(expected);
    });
  });
});
