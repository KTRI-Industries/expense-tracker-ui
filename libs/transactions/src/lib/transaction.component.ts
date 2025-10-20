import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { MatChipsModule } from '@angular/material/chips';
import { Category, TransactionDto } from '@expense-tracker-ui/shared/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { EnumToLabelConverter } from '@expense-tracker-ui/shared/formly';
import { CreateTransactionCommandUi } from './transaction.model';
import { categoryLabels } from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-transaction',
  templateUrl: './transaction.component.html',
  imports: [
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    ReactiveFormsModule,
    FormlyModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    JsonPipe,
  ],
})
export class TransactionComponent implements OnInit {
  private fb = inject(FormBuilder);

  /**
   * The transaction that will be edited (or the initial transaction data in case of creation).
   */
  @Input() selectedTransaction: TransactionDto | undefined | null;

  @Output() create = new EventEmitter<CreateTransactionCommandUi>();
  @Output() update = new EventEmitter<CreateTransactionCommandUi>();
  @Output() delete = new EventEmitter<string>();

  /**
   * The angular form group that will be related to formly form
   */
  transactionForm = this.fb.group({});

  /**
   * The formly fields that will be used to render the dynamic form.
   */
  fields: FormlyFieldConfig[] = [];

  /**
   * The model that will be used to store the form data.
   */
  model: CreateTransactionCommandUi | undefined;

  /**
   * Contains form state that is not part of the model.
   */
  options: FormlyFormOptions = {
    formState: {
      txType: 'EXPENSE',
    },
  };

  private labelCategoryConverter = new EnumToLabelConverter<Category>(
    categoryLabels,
  );

  ngOnInit(): void {
    // ic case where we are editing  an existing transaction, pre-populate the model with the transaction data.
    this.model = {
      amount: {
        currency: this.selectedTransaction?.amount.currency,
        amount: this.selectedTransaction?.amount.amount,
      },
      date: this.selectedTransaction?.date ?? '',
      description: this.selectedTransaction?.description,
      categories: this.selectedTransaction?.categories?.map((category) =>
        this.labelCategoryConverter.getLabelFromEnum(category),
      ),
      txType:
        (this.selectedTransaction?.amount?.amount ?? 0) >= 0
          ? 'INCOME'
          : 'EXPENSE',
      txId: this.selectedTransaction?.transactionId,
    };

    this.fields = [
      {
        key: 'txType',
        type: 'radio',
        defaultValue: 'EXPENSE',
        props: {
          label: 'Transaction Type',
          placeholder: 'Set transaction type',
          required: true,
          attributes: {
            autocomplete: 'off',
            'data-cy': 'tx-type-radio',
          },
          options: [
            { value: 'INCOME', label: 'Income' },
            { value: 'EXPENSE', label: 'Expense' },
          ],
          // Update the form state when the value of the radio button changes.
          change: (field: FormlyFieldConfig) => {
            this.options.formState.txType = field.formControl?.value;
          },
        },
      },
      {
        key: 'amount.amount',
        type: 'amount-input',
        props: {
          label: 'Transaction Amount',
          placeholder: 'Set transaction amount (positive or negative)',
          required: true,
          attributes: {
            autocomplete: 'off',
            'data-cy': 'tx-amount-input',
          },
        },
      },
      {
        key: 'date',
        type: 'datepicker',
        props: {
          label: 'Transaction Date',
          placeholder: 'Pick transaction date',
          required: true,
          attributes: {
            'data-cy': 'tx-date-picker',
          },
        },
      },
      {
        key: 'description',
        type: 'input',
        props: {
          label: 'Transaction Description',
          placeholder: 'Set transaction description',
          required: true,
          attributes: {
            'data-cy': 'tx-description-input',
          },
        },
      },
      {
        key: 'categories',
        type: 'chips',
        props: {
          label: 'Transaction Category',
          placeholder: 'Set transaction category',
          filters: categoryLabels,
        },
      },
    ];
  }

  onCreate() {
    if (this.transactionForm.valid) {
      this.create.emit(this.model);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  onUpdate() {
    if (this.transactionForm.valid) {
      this.update.emit(this.model);
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  onDelete() {
    this.delete.emit(this.selectedTransaction?.transactionId);
  }
}
