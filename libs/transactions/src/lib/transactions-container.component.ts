import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions, TransactionsSelectors } from '../index';
import { AsyncPipe } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { Observable } from 'rxjs';
import {
  Pageable,
  PageTransactionDto,
  TransactionDto,
} from '@expense-tracker-ui/shared/api';

@Component({
  selector: 'expense-tracker-ui-transactions-container',
  standalone: true,
  imports: [TransactionsComponent, AsyncPipe],
  template: `
    @if (transactions$ | async; as transactions) {
      <expense-tracker-ui-transactions
        [transactions]="transactions"
        (openTransactionForm)="onOpenTransactionForm()"
        (pageChange)="onPageableChange($event)"
        (sortChange)="onPageableChange($event)"
        (rowSelected)="onRowSelected($event)"></expense-tracker-ui-transactions>
    }
  `,
  styles: ``,
})
export class TransactionsContainerComponent implements OnInit {
  transactions$: Observable<PageTransactionDto | undefined> = this.store.select(
    TransactionsSelectors.selectAugmentedTransactions,
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      TransactionActions.initTransactions({ pageable: { page: 0 } }),
    );
  }

  onOpenTransactionForm() {
    this.store.dispatch(TransactionActions.openTransactionFrom());
  }

  /**
   * Method used both when page changes and when sort changes.
   */
  onPageableChange($event: Pageable) {
    this.store.dispatch(
      TransactionActions.initTransactions({ pageable: $event }),
    );
  }

  onRowSelected($event: TransactionDto) {
    this.store.dispatch(
      TransactionActions.editTransaction({
        transactionId: $event.transactionId,
      }),
    );
  }
}
