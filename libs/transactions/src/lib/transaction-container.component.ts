import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TransactionActions } from './+state/transactions.actions';
import { TransactionComponent } from './transaction.component';
import {
  Category,
  CreateTransactionCommand,
  TransactionDto,
  UpdateTransactionCommand,
} from '@expense-tracker-ui/shared/api';
import { selectCurrentTransaction } from './+state/transactions.selectors';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EnumToLabelConverter } from '@expense-tracker-ui/shared/formly';
import {
  categoryLabels,
  CreateTransactionCommandUi,
} from './transaction.model';

@Component({
  selector: 'expense-tracker-ui-transaction-container',
  imports: [TransactionComponent, AsyncPipe],
  template: `
    @if (selectedTransaction$ | async; as selectedTransaction) {
      <expense-tracker-ui-transaction
        [selectedTransaction]="selectedTransaction"
        (create)="onCreate($event)"
        (delete)="onDelete($event)"
        (update)="onUpdate($event)"></expense-tracker-ui-transaction>
    }
  `,
  styles: ``,
})
export class TransactionContainerComponent implements OnInit {
  selectedTransaction$: Observable<TransactionDto | undefined> =
    this.store.select(selectCurrentTransaction);

  private labelCategoryConverter = new EnumToLabelConverter<Category>(
    categoryLabels,
  );

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

  onCreate(model: CreateTransactionCommandUi) {
    const transaction: CreateTransactionCommand = {
      ...model,
      categories: model?.categories?.map((category) =>
        this.labelCategoryConverter.getEnumFromLabel(category),
      ),
      amount: this.transformAmount(model),
      date: model?.date ?? '',
    };
    this.store.dispatch(
      TransactionActions.createNewTransaction({ transaction }),
    );
  }

  onUpdate(model: CreateTransactionCommandUi) {
    const modifiedModel: UpdateTransactionCommand = {
      ...model,
      categories: model?.categories?.map((category) =>
        this.labelCategoryConverter.getEnumFromLabel(category),
      ),
      amount: this.transformAmount(model),
      date: model?.date ?? '',
      transactionId: model.txId ?? '',
    };
    this.store.dispatch(
      TransactionActions.updateTransaction({ transaction: modifiedModel }),
    );
  }

  onDelete($event: string) {
    this.store.dispatch(
      TransactionActions.deleteTransaction({ transactionId: $event }),
    );
  }

  private transformAmount(model: CreateTransactionCommandUi) {
    return {
      // if we do not spread the amount, after an error in backend the amount object is read only
      ...model?.amount,
      amount: this.getAmountByType(model?.amount.amount, model.txType),
    };
  }

  /**
   * Returns the amount with the correct sign based on the transaction type.
   */
  private getAmountByType(amount: number | undefined, txType: string) {
    return txType === 'EXPENSE' ? -(amount ?? 0) : amount;
  }
}
