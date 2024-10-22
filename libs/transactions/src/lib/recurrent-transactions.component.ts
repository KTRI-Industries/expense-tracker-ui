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
  PageRecurrentTransactionDto,
  RecurrentTransactionDto,
} from '@expense-tracker-ui/shared/api';
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
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { EnumToLabelPipe } from './enum-to-label.pipe';
import { MatChipListbox, MatChipOption } from '@angular/material/chips';
import { categoryLabels, recurrenceFrequencyLabels } from './transaction.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-recurrent-transactions',
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
    MatSort,
    MatSortHeader,
    EnumToLabelPipe,
    MatChipListbox,
    MatChipOption,
    RouterLink,
  ],
  templateUrl: './recurrent-transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class RecurrentTransactionsComponent {
  private _transactions: PageRecurrentTransactionDto | undefined;

  @Input()
  set transactions(value: PageRecurrentTransactionDto | undefined) {
    this._transactions = value;

    // TODO - this is a workaround, we should not be setting the datasource here
    this.transactionDatasource = new MatTableDataSource(
      this._transactions?.content,
    );
  }

  get transactions(): PageRecurrentTransactionDto | undefined {
    return this._transactions;
  }

  protected transactionDatasource:
    | MatTableDataSource<RecurrentTransactionDto>
    | undefined;

  transactionColumns = [
    'description',
    'user',
    'startDate',
    'endDate',
    'frequency',
    'category',
    'amount',
  ];

  @Output() openTransactionForm = new EventEmitter<unknown>();
  @Output() pageChange = new EventEmitter<Pageable>();
  @Output() sortChange = new EventEmitter<Pageable>();
  @Output() rowSelected = new EventEmitter<RecurrentTransactionDto>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  pageSize = 5;
  currentSort: Sort | undefined;

  initialSelection = [];
  selection;

  constructor() {
    this.selection = new SelectionModel<RecurrentTransactionDto>(
      false,
      this.initialSelection,
    );
  }

  onOpenTransactionForm() {
    this.openTransactionForm.emit();
  }

  onPageChange($event: PageEvent) {
    this.pageChange.emit(
      this.constructPageable(
        this.currentSort?.active,
        this.currentSort?.direction,
        $event.pageIndex,
      ),
    );
  }

  onSortChange($event: Sort) {
    this.currentSort = $event; // we need to keep somewhere the current sort to use it when the page changes. for the moment keep it in local state
    this.paginator.firstPage(); // reset paginator to the first page // TODO better way to do this?
    this.sortChange.emit(
      this.constructPageable($event.active, $event.direction),
    );
  }

  private constructPageable(column = 'date', direction = 'desc', page = 0) {
    return {
      page: page,
      sort: [`${column},${direction}`],
    };
  }

  onRowSelected(row: RecurrentTransactionDto) {
    console.log(row);
    this.rowSelected.emit(row);
  }

  protected readonly categoryLabels = categoryLabels;
  protected readonly recurrenceFrequencyLabels = recurrenceFrequencyLabels;
}