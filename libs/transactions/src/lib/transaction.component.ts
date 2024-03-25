import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import {
  Category,
  CreateTransactionCommand,
  TransactionDto,
  UpdateTransactionCommand,
} from '@expense-tracker-ui/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'expense-tracker-ui-transaction',
  standalone: true,

  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
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
  /**
   * The transaction that will be edited (or the initial transaction data in case of creation).
   */
  @Input() selectedTransaction: TransactionDto | undefined | null;

  @Output() create = new EventEmitter<CreateTransactionCommand>();
  @Output() update = new EventEmitter<UpdateTransactionCommand>();
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
  model: CreateTransactionCommand | undefined;

  /**
   * Contains form state that is not part of the model.
   */
  options: FormlyFormOptions = {
    formState: {
      txType: 'EXPENSE',
    },
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // ic case where we are editing  an existing transaction, pre-populate the model with the transaction data.
    this.model = {
      amount: {
        currency: this.selectedTransaction?.amount.currency,
        amount: this.selectedTransaction?.amount.amount,
      },
      date: this.selectedTransaction?.date ?? '',
      description: this.selectedTransaction?.description,
      category: this.selectedTransaction?.category,
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
        },
      },
      {
        key: 'description',
        type: 'input',
        props: {
          label: 'Transaction Description',
          placeholder: 'Set transaction description',
          required: true,
        },
      },
      {
        key: 'category',
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
      const modifiedModel: CreateTransactionCommand = {
        ...this.model!,
        category: this.getCategoryFromLabel(
          categoryLabels,
          this.model?.category?.[0],
        )!,

        amount: {
          ...this.model?.amount, // if we do not spread the amount, after an error in backend the amount object is read only
          amount: this.getAmountByType(this.model?.amount.amount),
        },
      };
      this.create.emit(modifiedModel);
    }
  }

  onUpdate() {
    if (this.transactionForm.valid) {
      const modifiedModel: UpdateTransactionCommand = {
        ...this.model!,
        category: this.getCategoryFromLabel(
          categoryLabels,
          this.model?.category?.[0],
        )!,

        amount: {
          ...this.model?.amount, // if we do not spread the amount, after an error in backend the amount object is read only
          amount: this.getAmountByType(this.model?.amount.amount),
        },
        transactionId: this.selectedTransaction?.transactionId ?? '',
      };
      this.update.emit(modifiedModel);
    }
  }

  onDelete() {
    this.delete.emit(this.selectedTransaction?.transactionId);
  }

  /**
   * Returns the amount with the correct sign based on the transaction type.
   */
  private getAmountByType(amount: number | undefined) {
    return this.options.formState.txType === 'EXPENSE'
      ? -(amount ?? 0)
      : amount;
  }

  /**
   * Returns the first category based on the label.
   * TODO: support multiple categories.
   */
  getCategoryFromLabel(
    categoryLabels: Record<Category, string>,
    selectedCategory: Category | undefined,
  ): Category[] {
    let cat = Object.keys(categoryLabels).find(
      (key) => categoryLabels[key as Category] === selectedCategory,
    );
    return cat != null ? ([cat] as Category[]) : [];
  }
}

export const categoryLabels: Record<Category, string> = {
  BILL: 'bills',
  ENTERTAINMENT: 'entertainment',
  GIFTS: 'gifts',
  GROCERIES: 'groceries',
  OTHER: 'other',
  RESTAURANT: 'restaurant',
  RENT: 'rent',
  SALARY: 'salary',
  SPORT: 'sport',
  TAXES: 'taxes',
  TRAVEL: 'travel',
};
