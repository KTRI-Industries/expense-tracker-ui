import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Category,
  RecurrenceFrequency,
  RecurrentTransactionDto,
} from '@expense-tracker-ui/shared/api';
import { CreateRecurrentTransactionCommandUi } from './transaction.model';
import { EnumToLabelConverter } from '@expense-tracker-ui/shared/formly';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { categoryLabels } from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-recurrent-transaction',
  imports: [
    CommonModule,
    FormlyModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    ReactiveFormsModule,
  ],
  templateUrl: './recurrent-transaction.component.html',
  styles: ``,
})
export class RecurrentTransactionComponent implements OnInit {
  private fb = inject(FormBuilder);

  /**
   * The transaction that will be edited (or the initial transaction data in case of creation).
   */
  @Input() selectedTransaction: RecurrentTransactionDto | undefined | null;

  @Output() create = new EventEmitter<CreateRecurrentTransactionCommandUi>();
  @Output() update = new EventEmitter<CreateRecurrentTransactionCommandUi>();
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
  model: CreateRecurrentTransactionCommandUi | undefined;

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
      description: this.selectedTransaction?.description ?? '',
      categories: this.selectedTransaction?.categories?.map((category) =>
        this.labelCategoryConverter.getLabelFromEnum(category),
      ),
      txType:
        (this.selectedTransaction?.amount?.amount ?? 0) >= 0
          ? 'INCOME'
          : 'EXPENSE',
      recurrentTxId: this.selectedTransaction?.recurrentTransactionId,
      recurrencePeriod: {
        frequency:
          this.selectedTransaction?.recurrencePeriod?.frequency ??
          RecurrenceFrequency.Daily,
        startDate: this.selectedTransaction?.recurrencePeriod?.startDate ?? '',
        endDate: this.selectedTransaction?.recurrencePeriod?.endDate ?? '',
      },
    };

    this.fields = [
      {
        key: 'recurrencePeriod.startDate',
        type: 'datepicker',
        props: {
          label: 'Start of recurrent transactions',
          placeholder: 'Pick start date',
          required: true,
          attributes: {
            'data-cy': 'recurrent-tx-start-date-picker',
          },
        },
      },
      {
        key: 'recurrencePeriod.endDate',
        type: 'datepicker',
        props: {
          label: 'End of recurrent transactions',
          placeholder: 'Pick end date',
          attributes: {
            'data-cy': 'tx-end-date-picker',
          },
        },
      },
      {
        key: 'recurrencePeriod.frequency',
        type: 'select',
        props: {
          label: 'Recurrence Frequency',
          placeholder: 'Set recurrence frequency',
          required: true,
          attributes: {
            'data-cy': 'tx-recurrence-frequency-select',
          },
          options: [
            { value: RecurrenceFrequency.Daily, label: 'Daily' },
            { value: RecurrenceFrequency.Monthly, label: 'Monthly' },
            { value: RecurrenceFrequency.Yearly, label: 'Yearly' },
          ],
        },
      },
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
            'data-cy': 'recurrent-tx-amount-input',
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
            'data-cy': 'recurrent-tx-description-input',
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
    this.delete.emit(this.selectedTransaction?.recurrentTransactionId);
  }
}
