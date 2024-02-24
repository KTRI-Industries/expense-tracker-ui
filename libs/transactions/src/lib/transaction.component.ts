import { Component, OnInit } from '@angular/core';
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
  ],
})
export class TransactionComponent implements OnInit {
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
        type: 'input',
        props: {
          label: 'Transaction Amount',
          placeholder: 'Set transaction amount (positive or negative)',
          required: true,
          type: 'number',
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
    console.log(this.model);
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
