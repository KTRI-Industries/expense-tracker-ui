import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { Moment } from 'moment';
import { ChartLegendComponent } from './chart-legend.component';

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
    ChartLegendComponent,
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
              <number>context.raw || 0,
              this.dashboard?.mainTransactionData?.totalExpense?.currency ||
                'EUR',
            ),
        },
      },
      legend: {
        display: false, // Disable the default legend
      },
    },
  };

  constructor(private chartFormattingService: ChartFormattingService) {}

  onDateRangeChange(event: { startDate: Moment; endDate: Moment }) {
    this.dateRangeChange.emit(event);
  }

  generateLegend(): {
    color: string;
    label: string | string[];
    value: number;
    percentage: number;
  }[] {
    if (
      !this.chartData ||
      !this.chartData.datasets[0] ||
      !this.chartData.labels
    ) {
      return [];
    }
    return this.chartFormattingService.customiseLegend(this.chartData);
  }
}
