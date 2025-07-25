import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { RecurrentTransactionsEffects } from './recurrent-transactions.effects';
import { TransactionsService } from '../transactions.service';
import { RecurrentTransactionActions } from './transactions.actions';
import { ErrorHandlingActions } from '@expense-tracker-ui/shared/error-handling';
import { cold, hot } from 'jasmine-marbles';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { 
  PageRecurrentTransactionDto, 
  RecurrentTransactionDto, 
  Pageable,
  MonetaryAmount,
  CreateRecurrentTransactionCommand,
  UpdateRecurrentTransactionCommand,
  RecurrenceFrequency,
  Category
} from '@expense-tracker-ui/shared/api';

describe('RecurrentTransactionsEffects', () => {
  let actions$: Observable<Action>;
  let effects: RecurrentTransactionsEffects;
  let service: TransactionsService;
  let router: Router;
  let snackBar: MatSnackBar;

  const createMonetaryAmount = (amount: number, currency = 'EUR'): MonetaryAmount => ({
    amount,
    currency,
  });

  const createMockCategory = (): Category => Category.Groceries;

  const createMockRecurrentTransaction = (): RecurrentTransactionDto => ({
    recurrentTransactionId: '1',
    tenantId: 'tenant-1',
    description: 'Test recurrent transaction',
    categories: [createMockCategory()],
    userId: 'user-1',
    amount: createMonetaryAmount(100),
    recurrencePeriod: {
      startDate: '2025-01-01',
      frequency: RecurrenceFrequency.Monthly
    }
  });

  const createMockPageRecurrentTransactions = (): PageRecurrentTransactionDto => ({
    content: [createMockRecurrentTransaction()],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RecurrentTransactionsEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            recurrentTransactions: {
              recurrentTransactions: null,
            },
          },
        }),
        {
          provide: TransactionsService,
          useValue: {
            getAllRecurrentTransactions: jest.fn(),
            getRecurrentTransaction: jest.fn(),
            createRecurrentTransaction: jest.fn(),
            updateRecurrentTransaction: jest.fn(),
            deleteRecurrentTransaction: jest.fn(),
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

    effects = TestBed.inject(RecurrentTransactionsEffects);
    service = TestBed.inject(TransactionsService);
    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
  });

  describe('retrieveRecurrentTransactions$', () => {
    it('should load recurrent transactions successfully', () => {
      const mockPageable: Pageable = { page: 0, size: 10 };
      const mockRecurrentTransactions = createMockPageRecurrentTransactions();

      jest.spyOn(service, 'getAllRecurrentTransactions').mockReturnValue(of(mockRecurrentTransactions));

      const action = RecurrentTransactionActions.initRecurrentTransactions({ pageable: mockPageable });
      const completion = RecurrentTransactionActions.loadRecurrentTransactionsSuccess({
        recurrentTransactions: mockRecurrentTransactions,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.retrieveRecurrentTransactions$).toBeObservable(expected);
      expect(service.getAllRecurrentTransactions).toHaveBeenCalledWith(mockPageable);
    });

    it('should handle errors when loading recurrent transactions', () => {
      const mockPageable: Pageable = { page: 0, size: 10 };
      const error = new Error('Error loading recurrent transactions');

      jest.spyOn(service, 'getAllRecurrentTransactions').mockReturnValue(throwError(() => error));

      const action = RecurrentTransactionActions.initRecurrentTransactions({ pageable: mockPageable });
      const completion = RecurrentTransactionActions.loadRecurrentTransactionsFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.retrieveRecurrentTransactions$).toBeObservable(expected);
    });
  });

  describe('loadTransaction$', () => {
    it('should load a single recurrent transaction if not already loaded', () => {
      const mockTransaction = createMockRecurrentTransaction();
      const recurrentTransactionId = '1';

      jest.spyOn(service, 'getRecurrentTransaction').mockReturnValue(of(mockTransaction));

      const action = RecurrentTransactionActions.loadRecurrentTransaction({ recurrentTransactionId });
      const completion = RecurrentTransactionActions.loadRecurrentTransactionSuccess({
        recurrentTransaction: mockTransaction,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.loadTransaction$).toBeObservable(expected);
      expect(service.getRecurrentTransaction).toHaveBeenCalledWith(recurrentTransactionId);
    });
  });

  describe('createTransaction$', () => {
    it('should create a recurrent transaction successfully', () => {
      const mockTransaction = createMockRecurrentTransaction();
      const recurrentTransactionCommand: CreateRecurrentTransactionCommand = {
        amount: createMonetaryAmount(100),
        description: 'Test recurrent transaction',
        recurrencePeriod: {
          startDate: '2025-01-01',
          frequency: RecurrenceFrequency.Monthly
        },
        categories: [createMockCategory()]
      };

      jest.spyOn(service, 'createRecurrentTransaction').mockReturnValue(of(mockTransaction));
      jest.spyOn(router, 'navigate');
      jest.spyOn(snackBar, 'open');

      const action = RecurrentTransactionActions.createNewRecurrentTransaction({ recurrentTransactionCommand });
      const completion = RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
        recurrentTransaction: mockTransaction,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createTransaction$).toBeObservable(expected);
      expect(service.createRecurrentTransaction).toHaveBeenCalledWith(recurrentTransactionCommand);
    });

    it('should handle errors when creating recurrent transaction', () => {
      const error = new Error('Error creating recurrent transaction');
      const recurrentTransactionCommand: CreateRecurrentTransactionCommand = {
        amount: createMonetaryAmount(100),
        description: 'Test recurrent transaction',
        recurrencePeriod: {
          startDate: '2025-01-01',
          frequency: RecurrenceFrequency.Monthly
        },
        categories: [createMockCategory()]
      };

      jest.spyOn(service, 'createRecurrentTransaction').mockReturnValue(throwError(() => error));

      const action = RecurrentTransactionActions.createNewRecurrentTransaction({ recurrentTransactionCommand });
      const completion = RecurrentTransactionActions.createNewRecurrentTransactionFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.createTransaction$).toBeObservable(expected);
    });
  });

  describe('openTransactionForm$', () => {
    it('should navigate to new transaction form', () => {
      jest.spyOn(router, 'navigate');

      const action = RecurrentTransactionActions.openRecurrentTransactionFrom();

      actions$ = hot('-a', { a: action });
      const expected = cold('-a', { a: action });

      expect(effects.openTransactionForm$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith([
        'transactions-page',
        'recurrent-transactions',
        'new',
      ]);
    });
  });

  describe('openTransactionFormToEdit$', () => {
    it('should navigate to edit transaction form', () => {
      const recurrentTransactionId = '1';
      jest.spyOn(router, 'navigate');

      const action = RecurrentTransactionActions.editRecurrentTransaction({ recurrentTransactionId });

      actions$ = hot('-a', { a: action });
      const expected = cold('-a', { a: action });

      expect(effects.openTransactionFormToEdit$).toBeObservable(expected);
      expect(router.navigate).toHaveBeenCalledWith([
        'transactions-page',
        'recurrent-transactions',
        recurrentTransactionId,
      ]);
    });
  });

  describe('deleteTransaction$', () => {
    it('should delete a recurrent transaction successfully', () => {
      const recurrentTransactionId = '1';

      jest.spyOn(service, 'deleteRecurrentTransaction').mockReturnValue(of(null));
      jest.spyOn(router, 'navigate');
      jest.spyOn(snackBar, 'open');

      const action = RecurrentTransactionActions.deleteRecurrentTransaction({ recurrentTransactionId });
      const completion = RecurrentTransactionActions.deleteRecurrentTransactionSuccess();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.deleteTransaction$).toBeObservable(expected);
      expect(service.deleteRecurrentTransaction).toHaveBeenCalledWith(recurrentTransactionId);
    });

    it('should handle errors when deleting recurrent transaction', () => {
      const recurrentTransactionId = '1';
      const error = new Error('Error deleting recurrent transaction');

      jest.spyOn(service, 'deleteRecurrentTransaction').mockReturnValue(throwError(() => error));

      const action = RecurrentTransactionActions.deleteRecurrentTransaction({ recurrentTransactionId });
      const completion = RecurrentTransactionActions.deleteRecurrentTransactionFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.deleteTransaction$).toBeObservable(expected);
    });
  });

  describe('updateTransaction$', () => {
    it('should update a recurrent transaction successfully', () => {
      const mockTransaction = createMockRecurrentTransaction();
      const updateRecurrentTransactionCommand: UpdateRecurrentTransactionCommand = {
        recurrentTransactionId: '1',
        amount: createMonetaryAmount(150),
        description: 'Updated recurrent transaction',
        recurrencePeriod: {
          startDate: '2025-01-01',
          frequency: RecurrenceFrequency.Daily
        },
        categories: [createMockCategory()]
      };

      jest.spyOn(service, 'updateRecurrentTransaction').mockReturnValue(of(mockTransaction));
      jest.spyOn(router, 'navigate');
      jest.spyOn(snackBar, 'open');

      const action = RecurrentTransactionActions.updateRecurrentTransaction({ updateRecurrentTransactionCommand });
      const completion = RecurrentTransactionActions.updateRecurrentTransactionSuccess({
        recurrentTransaction: mockTransaction,
      });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateTransaction$).toBeObservable(expected);
      expect(service.updateRecurrentTransaction).toHaveBeenCalledWith(updateRecurrentTransactionCommand);
    });

    it('should handle errors when updating recurrent transaction', () => {
      const error = new Error('Error updating recurrent transaction');
      const updateRecurrentTransactionCommand: UpdateRecurrentTransactionCommand = {
        recurrentTransactionId: '1',
        amount: createMonetaryAmount(150),
        description: 'Updated recurrent transaction',
        recurrencePeriod: {
          startDate: '2025-01-01',
          frequency: RecurrenceFrequency.Daily
        },
        categories: [createMockCategory()]
      };

      jest.spyOn(service, 'updateRecurrentTransaction').mockReturnValue(throwError(() => error));

      const action = RecurrentTransactionActions.updateRecurrentTransaction({ updateRecurrentTransactionCommand });
      const completion = RecurrentTransactionActions.updateRecurrentTransactionFailure({ error });

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.updateTransaction$).toBeObservable(expected);
    });
  });

  describe('clearError$', () => {
    it('should clear error on create success', () => {
      const mockTransaction = createMockRecurrentTransaction();
      const action = RecurrentTransactionActions.createNewRecurrentTransactionSuccess({
        recurrentTransaction: mockTransaction,
      });
      const completion = ErrorHandlingActions.clearBackEndError();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.clearError$).toBeObservable(expected);
    });

    it('should clear error on update success', () => {
      const mockTransaction = createMockRecurrentTransaction();
      const action = RecurrentTransactionActions.updateRecurrentTransactionSuccess({
        recurrentTransaction: mockTransaction,
      });
      const completion = ErrorHandlingActions.clearBackEndError();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.clearError$).toBeObservable(expected);
    });

    it('should clear error on delete success', () => {
      const action = RecurrentTransactionActions.deleteRecurrentTransactionSuccess();
      const completion = ErrorHandlingActions.clearBackEndError();

      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });

      expect(effects.clearError$).toBeObservable(expected);
    });
  });
});
