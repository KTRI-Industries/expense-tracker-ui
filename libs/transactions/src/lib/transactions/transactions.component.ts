import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'expense-tracker-ui-transactions',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
    MatList,
    MatListItem,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  @Input() transactions: PageTransactionDto | null = null;
}
