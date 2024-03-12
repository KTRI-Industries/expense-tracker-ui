import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions, TransactionsSelectors } from '../index';
import { AsyncPipe } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { Observable } from 'rxjs';
import { Pageable, PageTransactionDto } from '@expense-tracker-ui/api';

@Component({
  selector: 'expense-tracker-ui-transactions-container',
  standalone: true,
  imports: [TransactionsComponent, AsyncPipe],
  template: `
    @if (transactions$ | async; as transactions) {
    <expense-tracker-ui-transactions
      [transactions]="transactions"
      (openTransactionForm)="onOpenTransactionForm($event)"
      (pageChange)="onPageChange($event)"></expense-tracker-ui-transactions>
    }
  `,
  styles: ``,
})
export class TransactionsContainerComponent implements OnInit {
  transactions$: Observable<PageTransactionDto | undefined> = this.store.select(
    TransactionsSelectors.selectTransactions,
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(
      TransactionActions.initTransactions({ pageable: { page: 0 } }),
    );
  }

  onOpenTransactionForm($event: unknown) {
    this.store.dispatch(TransactionActions.openTransactionFrom());
  }

  onPageChange($event: Pageable) {
    this.store.dispatch(
      TransactionActions.initTransactions({ pageable: $event }),
    );
  }
}
