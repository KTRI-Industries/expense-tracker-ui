import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { TransactionsEffects } from './transactions.effects';
import { TransactionsService } from '../transactions.service';
import { TransactionActions } from './transactions.actions';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { cold, hot } from 'jasmine-marbles';
import { Action } from '@ngrx/store';

describe('TransactionsEffects', () => {
  let actions$: Observable<Action>;
  let effects: TransactionsEffects;
  let service: TransactionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsEffects,
        provideMockActions(() => actions$),
        {
          provide: TransactionsService,
          useValue: {
            getAllTransactions: jest.fn(),
          },
        },
      ],
    });

    effects = TestBed.inject(TransactionsEffects);
    service = TestBed.inject(TransactionsService);
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
});
