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

    const dataset = this.chartData.datasets[0];
    const totalValue = dataset.data.reduce((sum, value) => sum + value, 0);

    // Ensure backgroundColor is treated as an array
    const backgroundColors = Array.isArray(dataset.backgroundColor)
      ? (dataset.backgroundColor as string[])
      : [];

    const legendItems = this.chartData.labels.map((label, index) => ({
      label,
      value: dataset.data[index],
      color: backgroundColors[index] || '#000', // Default to black if color is missing
      percentage: totalValue ? (dataset.data[index] / totalValue) * 100 : 0,
    }));

    // Sort legend items in descending order based on percentage
    return legendItems.sort((a, b) => b.percentage - a.percentage);
  }
}
