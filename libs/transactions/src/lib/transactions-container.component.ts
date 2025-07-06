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
import { FilterRange } from '@expense-tracker-ui/dashboard';
import { AuthActions } from '@expense-tracker-ui/shared/auth';

@Component({
  selector: 'expense-tracker-ui-transactions-container',
  imports: [TransactionsComponent, AsyncPipe],
  template: `
    @if (transactions$ | async; as transactions) {
      <expense-tracker-ui-transactions
        [transactions]="transactions"
        [filterRange]="filterRange$ | async"
        (openTransactionForm)="onOpenTransactionForm()"
        (pageChange)="onPageableChange($event)"
        (sortChange)="onPageableChange($event)"
        (rowSelected)="onRowSelected($event)"
        (dateRangeChange)="
          onDateRangeChange($event)
        "></expense-tracker-ui-transactions>
    }
  `,
  styles: ``,
})
export class TransactionsContainerComponent implements OnInit {
  transactions$: Observable<PageTransactionDto | undefined> = this.store.select(
    TransactionsSelectors.selectAugmentedTransactions,
  );

  filterRange$ = this.store.select(TransactionsSelectors.selectFilterRange);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.retrieveTenantUsers());

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
  onPageableChange({
    pageable,
    filterRange,
  }: {
    pageable: Pageable;
    filterRange: FilterRange | undefined | null;
  }) {
    this.store.dispatch(
      TransactionActions.initTransactions({
        pageable,
        filterRange,
      }),
    );
  }

  onRowSelected($event: TransactionDto) {
    this.store.dispatch(
      TransactionActions.editTransaction({
        transactionId: $event.transactionId,
      }),
    );
  }

  onDateRangeChange({
    pageable,
    filterRange,
  }: {
    pageable: Pageable;
    filterRange: FilterRange | undefined | null;
  }) {
    this.store.dispatch(TransactionActions.setFilterRange({ filterRange }));
    this.store.dispatch(
      TransactionActions.initTransactions({
        pageable: { page: 0 },
        filterRange: filterRange,
      }),
    );
  }
}
