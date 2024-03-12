import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import {
  Pageable,
  PageTransactionDto,
  TransactionDto,
} from '@expense-tracker-ui/api';
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
    MatPaginator,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements AfterViewInit {
  private _transactions: PageTransactionDto | undefined;

  @Input()
  set transactions(value: PageTransactionDto | undefined) {
    this._transactions = value;

    // TODO - this is a workaround, we should not be setting the datasource here
    this.transactionDatasource = new MatTableDataSource(
      this._transactions?.content,
    );
  }

  get transactions(): PageTransactionDto | undefined {
    return this._transactions;
  }

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
  @Output() pageChange = new EventEmitter<Pageable>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;

  ngAfterViewInit(): void {
    this.transactionDatasource = new MatTableDataSource(
      this.transactions?.content,
    );
  }

  onOpenTransactionForm() {
    this.openTransactionForm.emit();
  }

  onPageChange($event: PageEvent) {
    this.pageChange.emit({
      page: $event.pageIndex,
    });
  }
}
