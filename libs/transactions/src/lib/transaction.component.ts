import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { Category, CreateTransactionCommand } from '@expense-tracker-ui/api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import {default as _rollupMoment} from 'moment';
const moment = _rollupMoment || _moment;

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
  ],
})
export class TransactionComponent implements OnInit {
  @Output() create = new EventEmitter<CreateTransactionCommand>();

  transactionForm = this.fb.group({});
  fields: FormlyFieldConfig[] = [];
  model: CreateTransactionCommand = {
    amount: {
      currency: 'EUR',
      amount: undefined,
    },
    date: '',
    description: '',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fields = [
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
      // TODO allow array of categories in the backend to remove this hack
      const modifiedModel: CreateTransactionCommand = {
        ...this.model,
        category: Object.values(Category).find(
          (c) => c === this.model.category?.[0],
        ),
        amount: {
          ...this.model.amount, // if we do not spread the amount, after an error in backend the amount object is read only
          amount: this.model.amount.amount,
        },
        // if we send date directly it is sent with timezone and then in backend date in utc is calculated wrongly
        date: moment(this.model.date).format('YYYY-MM-DDT00:00:00'),
      };
      this.create.emit(modifiedModel);
    }
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
