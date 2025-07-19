import {
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
} from '@expense-tracker-ui/shared/api';
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
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { EnumToLabelPipe } from './enum-to-label.pipe';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import {
  DashboardFilterComponent,
  FilterRange,
} from '@expense-tracker-ui/dashboard';
import { categoryLabels } from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-transactions',
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatCardSubtitle,
    MatCardHeader,
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
    MatSort,
    MatSortHeader,
    EnumToLabelPipe,
    MatChipListbox,
    MatChipOption,
    RouterLink,
    DashboardFilterComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  private _transactions: PageTransactionDto | undefined;

  @Input() filterRange: FilterRange | undefined | null;

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

  transactionColumns = ['description', 'user', 'date', 'category', 'amount'];

  @Output() openTransactionForm = new EventEmitter<unknown>();
  @Output() pageChange = new EventEmitter<{
    pageable: Pageable;
    filterRange: FilterRange | undefined | null;
  }>();
  @Output() sortChange = new EventEmitter<{
    pageable: Pageable;
    filterRange: FilterRange | undefined | null;
  }>();
  @Output() rowSelected = new EventEmitter<TransactionDto>();

  @Output() dateRangeChange = new EventEmitter<{
    pageable: Pageable;
    filterRange: FilterRange | undefined | null;
  }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() pageSizeOptions: number[] = [5, 10, 25, 50, 100, 1000];

  pageSize = 5;
  currentSort: Sort | undefined;

  initialSelection = [];
  selection;

  constructor() {
    this.selection = new SelectionModel<TransactionDto>(
      false,
      this.initialSelection,
    );
  }

  onOpenTransactionForm() {
    this.openTransactionForm.emit();
  }

  onDateRangeChange(range: FilterRange) {
    this.dateRangeChange.emit({
      pageable: { page: 0, size: this.pageSize },
      filterRange: range,
    });
  }

  onPageChange($event: PageEvent) {
    this.pageSize = $event.pageSize;
    const pageable = this.constructPageable(
      this.currentSort?.active,
      this.currentSort?.direction,
      $event.pageIndex,
      $event.pageSize,
    );
    this.pageChange.emit({ pageable, filterRange: this.filterRange });
  }

  onSortChange($event: Sort) {
    this.currentSort = $event;
    this.paginator.firstPage();
    const pageable = this.constructPageable($event.active, $event.direction);
    this.sortChange.emit({ pageable, filterRange: this.filterRange });
  }

  private constructPageable(
    column = 'date',
    direction = 'desc',
    page = 0,
    size = this.pageSize,
  ): Pageable {
    return {
      page: page,
      sort: [`${column},${direction}`],
      size: size,
    };
  }

  onRowSelected(row: TransactionDto) {
    console.log(row);
    this.rowSelected.emit(row);
  }

  protected readonly categoryLabels = categoryLabels;
}
