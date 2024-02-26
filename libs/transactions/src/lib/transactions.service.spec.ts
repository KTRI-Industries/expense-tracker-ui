import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import {
  PageTransactionDto,
  TransactionControllerService,
} from '@expense-tracker-ui/api';
import { Observable, of, throwError } from 'rxjs';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let api: TransactionControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransactionsService,
        {
          provide: TransactionControllerService,
          useValue: {
            retrieve: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(TransactionsService);
    api = TestBed.inject(TransactionControllerService);
  });

  it('retrieves transactions successfully', fakeAsync(() => {
    const transactions: PageTransactionDto = {
      // fill with mock data
    };
    (
      jest.spyOn(api, 'retrieve') as unknown as jest.SpyInstance<
        Observable<PageTransactionDto>
      >
    ).mockReturnValue(of(transactions));

    let result: PageTransactionDto | undefined;
    service.getAllTransactions().subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toEqual(transactions);
  }));

  it('handles errors when retrieving transactions', fakeAsync(() => {
    const error = new Error('Error retrieving transactions');
    jest.spyOn(api, 'retrieve').mockReturnValue(throwError(error));

    let resultError: Error | undefined;
    service.getAllTransactions().subscribe(
      () => {},
      (err) => {
        resultError = err;
      },
    );

    tick();

    expect(resultError).toEqual(error);
  }));
});
