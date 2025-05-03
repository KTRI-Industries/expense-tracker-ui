import { inject, Injectable } from '@angular/core';
import {
  CreateRecurrentTransactionCommand,
  CreateTransactionCommand,
  Pageable,
  PageTransactionDto,
  RecurrentTransactionControllerService,
  TransactionControllerService,
  TransactionDto,
  UpdateRecurrentTransactionCommand,
  UpdateTransactionCommand,
} from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private api: TransactionControllerService = inject(
    TransactionControllerService,
  ); // TODO better way to reference the generated code?

  private recurrentApi: RecurrentTransactionControllerService = inject(
    RecurrentTransactionControllerService,
  );

  getAllTransactions(pageable?: Pageable): Observable<PageTransactionDto> {
    return this.api.retrieveTransactions({
      page: pageable?.page ?? 0,
      size: pageable?.size ?? 5,
      sort: pageable?.sort ?? ['date,desc'],
    });
  }

  createTransaction(transaction: CreateTransactionCommand) {
    return this.api.create(transaction);
  }

  getTransaction(transactionId: string): Observable<TransactionDto> {
    return this.api.retrieve(transactionId);
  }

  deleteTransaction(transactionId: string) {
    return this.api._delete(transactionId);
  }

  updateTransaction(updateTransactionCommand: UpdateTransactionCommand) {
    return this.api.update(
      updateTransactionCommand.transactionId,
      updateTransactionCommand,
    );
  }

  getAllRecurrentTransactions(pageable: Pageable) {
    return this.recurrentApi.retrieveRecurrentTransactions({
      page: pageable.page,
      size: pageable.size,
      sort: pageable.sort,
    });
  }

  getRecurrentTransaction(recurrentTransactionId: string) {
    return this.recurrentApi.retrieve1(recurrentTransactionId);
  }

  createRecurrentTransaction(
    recurrentTransaction: CreateRecurrentTransactionCommand,
  ) {
    return this.recurrentApi.create1(recurrentTransaction);
  }

  deleteRecurrentTransaction(recurrentTransactionId: string) {
    return this.recurrentApi.delete1(recurrentTransactionId);
  }

  updateRecurrentTransaction(
    updateRecurrentTransactionCommand: UpdateRecurrentTransactionCommand,
  ) {
    return this.recurrentApi.update1(
      updateRecurrentTransactionCommand.recurrentTransactionId,
      updateRecurrentTransactionCommand,
    );
  }
}
