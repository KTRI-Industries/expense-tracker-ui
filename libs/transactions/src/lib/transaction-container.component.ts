import { Component } from '@angular/core';
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

@Component({
  selector: 'expense-tracker-ui-transaction-container',
  standalone: true,
  imports: [TransactionComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-transaction
      [selectedTransaction]="selectedTransaction$ | async"
      (create)="onCreate($event)"></expense-tracker-ui-transaction>
  `,
  styles: ``,
})
export class TransactionContainerComponent {
  selectedTransaction$: Observable<TransactionDto | undefined> =
    this.store.select(selectCurrentTransaction);

  constructor(private store: Store) {}

  onCreate($event: CreateTransactionCommand) {
    this.store.dispatch(
      TransactionActions.createNewTransaction({ transaction: $event }),
    );
  }
}
