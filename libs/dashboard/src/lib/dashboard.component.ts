import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { Moment } from 'moment';

@Component({
  selector: 'expense-tracker-ui-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    BaseChartDirective,
    DashboardFilterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent {
  @Input() chartData:
    | ChartData<'doughnut', number[], string | string[]>
    | undefined
    | null = null;

  @Input() dashboard: DashboardDto | undefined | null = null;

  @Output() dateRangeChange = new EventEmitter<{
    startDate: Moment;
    endDate: Moment;
  }>();

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            this.chartFormattingService.formatTooltipLabel(
              context,
              this.dashboard?.mainTransactionData?.totalExpense?.currency ||
                'EUR',
            ),
        },
      },
    },
  };

  constructor(private chartFormattingService: ChartFormattingService) {}

  onDateRangeChange(event: { startDate: Moment; endDate: Moment }) {
    this.dateRangeChange.emit(event);
  }
}
