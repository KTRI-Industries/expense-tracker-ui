import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import {
  Pageable,
  PageRecurrentTransactionDto,
  RecurrentTransactionDto,
} from '@expense-tracker-ui/shared/api';
import { RecurrentTransactionsComponent } from './recurrent-transactions.component';
import {
  RecurrentTransactionActions,
  RecurrentTransactionsSelectors,
} from '../index';

@Component({
  selector: 'expense-tracker-ui-recurrent-transactions-container',
  imports: [AsyncPipe, RecurrentTransactionsComponent],
  template: `
    @if (transactions$ | async; as transactions) {
      <expense-tracker-ui-recurrent-transactions
        [transactions]="transactions"
        (openTransactionForm)="onOpenTransactionForm()"
        (pageChange)="onPageableChange($event)"
        (sortChange)="onPageableChange($event)"
        (rowSelected)="
          onRowSelected($event)
        "></expense-tracker-ui-recurrent-transactions>
    }
  `,
  styles: ``,
})
export class RecurrentTransactionsContainerComponent implements OnInit {
  private store = inject(Store);

  transactions$: Observable<PageRecurrentTransactionDto | undefined> =
    this.store.select(
      RecurrentTransactionsSelectors.selectAugmentedRecurrentTransactions,
    );

  ngOnInit(): void {
    this.store.dispatch(
      RecurrentTransactionActions.initRecurrentTransactions({
        pageable: { page: 0 },
      }),
    );
  }

  onOpenTransactionForm() {
    this.store.dispatch(
      RecurrentTransactionActions.openRecurrentTransactionFrom(),
    );
  }

  /**
   * Method used both when page changes and when sort changes.
   */
  onPageableChange($event: Pageable) {
    this.store.dispatch(
      RecurrentTransactionActions.initRecurrentTransactions({
        pageable: $event,
      }),
    );
  }

  onRowSelected($event: RecurrentTransactionDto) {
    this.store.dispatch(
      RecurrentTransactionActions.editRecurrentTransaction({
        recurrentTransactionId: $event.recurrentTransactionId,
      }),
    );
  }
}
