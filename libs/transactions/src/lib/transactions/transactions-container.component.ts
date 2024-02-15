import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions, TransactionsSelectors } from '../../index';
import { AsyncPipe } from '@angular/common';
import { TransactionsComponent } from './transactions.component';

@Component({
  selector: 'transactions-container',
  standalone: true,
  imports: [TransactionsComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-transactions
      [transactions]="transactions$ | async"></expense-tracker-ui-transactions>
  `,
  styles: ``,
})
export class TransactionsContainerComponent implements OnInit {
  transactions$ = this.store.select(TransactionsSelectors.selectTransactions);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(TransactionActions.initTransactions());
  }
}
