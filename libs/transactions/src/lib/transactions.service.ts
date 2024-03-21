import { inject, Injectable } from '@angular/core';
import {
  CreateTransactionCommand,
  Pageable,
  PageTransactionDto,
  TransactionControllerService,
  TransactionDto,
} from '@expense-tracker-ui/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private api: TransactionControllerService = inject(
    TransactionControllerService,
  ); // TODO better way to reference the generated code?

  getAllTransactions(pageable?: Pageable): Observable<PageTransactionDto> {
    return this.api.retrieve({
      page: pageable?.page ?? 0,
      size: pageable?.size ?? 5,
      sort: pageable?.sort ?? ['date,desc'],
    });
  }

  createTransaction(transaction: CreateTransactionCommand) {
    return this.api.create(transaction);
  }

  getTransaction(transactionId: string): Observable<TransactionDto> {
    return this.api.retrieve1(transactionId);
  }
}
