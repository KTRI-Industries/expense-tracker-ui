import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from './+state/transactions.actions';
import { TransactionComponent } from './transaction.component';
import {
  CreateTransactionCommand,
  TransactionDto,
} from '@expense-tracker-ui/api';
import { selectCurrentTransaction } from './+state/transactions.selectors';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-transaction-container',
  standalone: true,
  imports: [TransactionComponent, AsyncPipe],
  template: `
    @if (selectedTransaction$ | async; as selectedTransaction) {
    <expense-tracker-ui-transaction
      [selectedTransaction]="selectedTransaction"
      (create)="onCreate($event)"></expense-tracker-ui-transaction>
    }
  `,
  styles: ``,
})
export class TransactionContainerComponent implements OnInit {
  selectedTransaction$: Observable<TransactionDto | undefined> =
    this.store.select(selectCurrentTransaction);

  constructor(
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  /**
   * Load the transaction if the id is present in the route. (case where user navigates directly to url).
   */
  ngOnInit() {
    const transactionId = this.route.snapshot.paramMap.get('id');
    if (transactionId) {
      this.store.dispatch(
        TransactionActions.loadTransaction({
          transactionId: transactionId,
        }),
      );
    }
  }

  onCreate($event: CreateTransactionCommand) {
    this.store.dispatch(
      TransactionActions.createNewTransaction({ transaction: $event }),
    );
  }
}
