import { Component, inject } from '@angular/core';
import { ImportTransactionsComponent } from './import-transactions.component';
import { TransactionActions } from './+state/transactions.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'expense-tracker-ui-import-transactions-container',
  template: `
    <expense-tracker-ui-import-transactions
      (import)="onImport($event)"></expense-tracker-ui-import-transactions>
  `,
  styles: [],
  imports: [ImportTransactionsComponent],
})
export class ImportTransactionsContainerComponent {
  private store = inject(Store);

  onImport(file: File): void {
    this.store.dispatch(
      TransactionActions.importTransactions({
        fileContent: file,
      }),
    );
  }
}
