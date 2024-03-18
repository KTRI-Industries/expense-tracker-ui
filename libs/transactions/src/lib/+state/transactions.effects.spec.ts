import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TransactionsEffects } from './transactions.effects';
import { TransactionsService } from '../transactions.service';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { cold, hot } from 'jasmine-marbles';
import { Action } from '@ngrx/store';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
        {
          provide: TransactionsService,
          useValue: {
            getAllTransactions: jest.fn(),
            createTransaction: jest.fn(),
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
    const action = TransactionActions.initTransactions({} as any);
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
    const action = TransactionActions.initTransactions({} as any);
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
    expect(router.navigate).toHaveBeenCalledWith(['transactions']);
    expect(snackBar.open).toHaveBeenCalledWith('Transaction created', 'Close');
  });

  it('should open the transaction form', () => {
    jest.spyOn(router, 'navigate');

    actions$ = of(TransactionActions.openTransactionFrom());

    effects.openTransactionForm$.subscribe();

    expect(router.navigate).toHaveBeenCalledWith(['transactions', 'new']);
  });
});
