import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from './+state/transactions.actions';
import { TransactionComponent } from './transaction.component';

@Component({
  selector: 'expense-tracker-ui-transaction-container',
  standalone: true,
  imports: [TransactionComponent],
  template: `
    <expense-tracker-ui-transaction></expense-tracker-ui-transaction>
  `,
  styles: ``,
})
export class TransactionContainerComponent {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(TransactionActions.createNewTransaction());
  }
}
