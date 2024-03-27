import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TransactionsService } from './transactions.service';
import {
  PageTransactionDto,
  TransactionControllerService,
  TransactionDto,
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
            create: jest.fn(),
            update: jest.fn(),
            _delete: jest.fn(),
            retrieve1: jest.fn(),
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
    jest.spyOn(api, 'retrieve').mockReturnValue(throwError(() => error));

    service.getAllTransactions().subscribe({
      error: (err) => {
        expect(err).toEqual(error);
      },
    });

    tick();
  }));

  it('creates a new transaction successfully', fakeAsync(() => {
    const transaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    (
      jest.spyOn(api, 'create') as unknown as jest.SpyInstance<
        Observable<TransactionDto>
      >
    ).mockReturnValue(of(transaction));

    let result: TransactionDto | undefined;
    service.createTransaction(transaction).subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toEqual(transaction);
  }));

  it('handles errors when creating a new transaction', fakeAsync(() => {
    const transaction = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    const error = new Error('Error creating transaction');
    jest.spyOn(api, 'create').mockReturnValue(throwError(() => error));

    let resultError: Error | undefined;
    service.createTransaction(transaction).subscribe({
      error: (err) => {
        resultError = err;
      },
    });

    tick();

    expect(resultError).toEqual(error);
  }));

  it('updates a transaction successfully', fakeAsync(() => {
    const transaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    (
      jest.spyOn(api, 'update') as unknown as jest.SpyInstance<
        Observable<TransactionDto>
      >
    ).mockReturnValue(of(transaction));

    let result: TransactionDto | undefined;
    service.updateTransaction(transaction).subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toEqual(transaction);
  }));

  it('handles errors when updating a transaction', fakeAsync(() => {
    const transaction = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    const error = new Error('Error updating transaction');
    jest.spyOn(api, 'update').mockReturnValue(throwError(() => error));

    let resultError: Error | undefined;
    service.updateTransaction(transaction).subscribe({
      error: (err) => {
        resultError = err;
      },
    });

    tick();

    expect(resultError).toEqual(error);
  }));

  it('deletes a transaction successfully', fakeAsync(() => {
    const transactionId = '1';
    (
      jest.spyOn(api, '_delete') as unknown as jest.SpyInstance<
        Observable<void>
      >
    ).mockReturnValue(of(undefined));

    let result: void | undefined;
    service.deleteTransaction(transactionId).subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toBeUndefined();
  }));

  it('handles errors when deleting a transaction', fakeAsync(() => {
    const transactionId = '1';
    const error = new Error('Error deleting transaction');
    jest.spyOn(api, '_delete').mockReturnValue(throwError(() => error));

    let resultError: Error | undefined;
    service.deleteTransaction(transactionId).subscribe({
      error: (err) => {
        resultError = err;
      },
    });

    tick();

    expect(resultError).toEqual(error);
  }));

  it('retrieves a transaction successfully', fakeAsync(() => {
    const transaction: TransactionDto = {
      transactionId: '1',
      amount: {
        currency: 'EUR',
        amount: 100,
      },
      date: new Date().toDateString(),
      description: 'Test',
      tenantId: '1',
    };
    (
      jest.spyOn(api, 'retrieve1') as unknown as jest.SpyInstance<
        Observable<TransactionDto>
      >
    ).mockReturnValue(of(transaction));

    let result: TransactionDto | undefined;
    service.getTransaction(transaction.transactionId).subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toEqual(transaction);
  }));

  it('handles errors when retrieving a transaction', fakeAsync(() => {
    const transactionId = '1';
    const error = new Error('Error retrieving transaction');
    jest.spyOn(api, 'retrieve1').mockReturnValue(throwError(() => error));

    let resultError: Error | undefined;
    service.getTransaction(transactionId).subscribe({
      error: (err) => {
        resultError = err;
      },
    });

    tick();

    expect(resultError).toEqual(error);
  }));
});
