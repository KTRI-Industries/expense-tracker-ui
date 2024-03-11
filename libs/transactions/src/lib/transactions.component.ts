import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { PageTransactionDto, TransactionDto } from '@expense-tracker-ui/api';
import { MatList, MatListItem } from '@angular/material/list';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatButton } from '@angular/material/button';

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
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatButton,
    MatCardActions,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit {
  @Input() transactions: PageTransactionDto | undefined;

  protected transactionDatasource:
    | MatTableDataSource<TransactionDto>
    | undefined;

  transactionColumns = [
    'position',
    'amount',
    'description',
    'date',
    'category',
  ];
  @Output() openTransactionForm = new EventEmitter<unknown>();

  ngOnInit(): void {
    this.transactionDatasource = new MatTableDataSource(
      this.transactions?.content,
    );
  }

  onOpenTransactionForm() {
    this.openTransactionForm.emit();
  }
}
