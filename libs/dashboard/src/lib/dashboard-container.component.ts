import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  DashboardActions,
  DashboardComponent,
  DashboardSelectors,
} from '../index';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { ChartData } from 'chart.js';

@Component({
  selector: 'expense-tracker-ui-dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <expense-tracker-ui-dashboard
      [dashboard]="dashboard$ | async"
      [chartData]="chartData$ | async"></expense-tracker-ui-dashboard>
  `,
})
export class DashboardContainerComponent implements OnInit {
  dashboard$: Observable<DashboardDto | undefined | null> = this.store.select(
    DashboardSelectors.selectDashboard,
  );
  chartData$: Observable<ChartData<'doughnut', number[], string | string[]>> =
    this.store.select(DashboardSelectors.selectChartData);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.initDashboard());
  }
}
