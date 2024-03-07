import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from './+state/transactions.actions';
import { TransactionComponent } from './transaction.component';
import { CreateTransactionCommand } from '@expense-tracker-ui/api';

@Component({
  selector: 'expense-tracker-ui-transaction-container',
  standalone: true,
  imports: [TransactionComponent],
  template: `
    <expense-tracker-ui-transaction
      (create)="onCreate($event)"></expense-tracker-ui-transaction>
  `,
  styles: ``,
})
export class TransactionContainerComponent {
  constructor(private store: Store) {}

  onCreate($event: CreateTransactionCommand) {
    this.store.dispatch(
      TransactionActions.createNewTransaction({ transaction: $event }),
    );
  }
}
