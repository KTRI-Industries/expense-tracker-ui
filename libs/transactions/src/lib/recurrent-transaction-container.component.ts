import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RecurrentTransactionActions } from './+state/transactions.actions';
import {
  Category,
  CreateRecurrentTransactionCommand,
  RecurrentTransactionDto,
  UpdateRecurrentTransactionCommand,
} from '@expense-tracker-ui/shared/api';
import { selectCurrentRecurrentTransaction } from './+state/recurrent-transactions.selectors';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EnumToLabelConverter } from '@expense-tracker-ui/shared/formly';
import { CreateRecurrentTransactionCommandUi } from './transaction.model';
import { RecurrentTransactionComponent } from './recurrent-transaction.component';
import { categoryLabels } from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-recurrent-transaction-container',
  imports: [AsyncPipe, RecurrentTransactionComponent],
  template: `
    @if (selectedTransaction$ | async; as selectedTransaction) {
      <expense-tracker-ui-recurrent-transaction
        [selectedTransaction]="selectedTransaction"
        (create)="onCreate($event)"
        (delete)="onDelete($event)"
        (update)="onUpdate($event)"></expense-tracker-ui-recurrent-transaction>
    }
  `,
  styles: ``,
})
export class RecurrentTransactionContainerComponent implements OnInit {
  selectedTransaction$: Observable<RecurrentTransactionDto | undefined> =
    this.store.select(selectCurrentRecurrentTransaction);

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
        RecurrentTransactionActions.loadRecurrentTransaction({
          recurrentTransactionId: transactionId,
        }),
      );
    }
  }

  onCreate(model: CreateRecurrentTransactionCommandUi) {
    const recurrentTransactionCommand: CreateRecurrentTransactionCommand = {
      ...model,
      categories:
        model?.categories?.map((category) =>
          this.labelCategoryConverter.getEnumFromLabel(category),
        ) ?? [],
      amount: this.transformAmount(model),
      recurrencePeriod: model?.recurrencePeriod ?? '',
    };
    this.store.dispatch(
      RecurrentTransactionActions.createNewRecurrentTransaction({
        recurrentTransactionCommand: recurrentTransactionCommand,
      }),
    );
  }

  onUpdate(model: CreateRecurrentTransactionCommandUi) {
    const modifiedModel: UpdateRecurrentTransactionCommand = {
      ...model,
      categories:
        model?.categories?.map((category) =>
          this.labelCategoryConverter.getEnumFromLabel(category),
        ) ?? [],
      amount: this.transformAmount(model),
      recurrencePeriod: model?.recurrencePeriod ?? '',
      recurrentTransactionId: model?.recurrentTxId ?? '',
    };
    this.store.dispatch(
      RecurrentTransactionActions.updateRecurrentTransaction({
        updateRecurrentTransactionCommand: modifiedModel,
      }),
    );
  }

  onDelete($event: string) {
    this.store.dispatch(
      RecurrentTransactionActions.deleteRecurrentTransaction({
        recurrentTransactionId: $event,
      }),
    );
  }

  private transformAmount(model: CreateRecurrentTransactionCommandUi) {
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
