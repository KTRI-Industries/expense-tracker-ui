import { inject, Injectable } from '@angular/core';
import {
  PageTransactionDto,
  TransactionControllerService,
} from '@expense-tracker-ui/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  private api: TransactionControllerService = inject(
    TransactionControllerService,
  ); // TODO better way to reference the generated code?

  getAllTransactions(): Observable<PageTransactionDto> {
    return this.api.retrieve({ page: 0, size: 10, sort: [] });
  }
}
