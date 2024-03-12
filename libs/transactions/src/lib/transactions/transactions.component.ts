import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'expense-tracker-ui-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {}
