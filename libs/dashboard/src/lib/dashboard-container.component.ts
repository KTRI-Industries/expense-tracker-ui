import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardComponent,
  DashboardSelectors,
  FilterRange,
} from '../index';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { ChartData } from 'chart.js';

@Component({
  selector: 'expense-tracker-ui-dashboard-container',
  imports: [CommonModule, DashboardComponent],
  template: `
    <expense-tracker-ui-dashboard
      [dashboard]="dashboard$ | async"
      [groupedExpensesChartData]="groupedExpensesChartData$ | async"
      [incomeExpensePerMonthChartData]="incomeExpensePerMonthChartData$ | async"
      [expensesPerUserChartData]="expensesPerUserChartData$ | async"
      [filterRange]="filterRange$ | async"
      (dateRangeChange)="
        dateRangeChange($event)
      "></expense-tracker-ui-dashboard>
  `,
})
export class DashboardContainerComponent implements OnInit {
  dashboard$: Observable<DashboardDto | undefined | null> = this.store.select(
    DashboardSelectors.selectDashboard,
  );
  filterRange$: Observable<FilterRange | undefined | null> = this.store.select(
    DashboardSelectors.selectFilterRange,
  );

  groupedExpensesChartData$: Observable<
    ChartData<'doughnut', number[], string | string[]>
  > = this.store.select(DashboardSelectors.selectGroupedExpensesChartData);

  incomeExpensePerMonthChartData$: Observable<
    ChartData<'bar', number[], string | string[]>
  > = this.store.select(
    DashboardSelectors.selectIncomeExpensePerMonthChartData,
  );

  expensesPerUserChartData$: Observable<ChartData<
    'line',
    number[],
    string | string[]
  > | null> = this.store.select(
    DashboardSelectors.selectExpensesPerUserChartData,
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.initDashboard());
  }

  dateRangeChange(filterRange: FilterRange) {
    this.store.dispatch(DashboardActions.dateRangeChange({ filterRange }));
  }
}
