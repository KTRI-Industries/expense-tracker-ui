import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { ChartLegendComponent } from './chart-legend.component';
import { FilterRange } from './+state/dashboard.reducer';

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
  @Input() groupedExpensesChartData:
    | ChartData<'doughnut', number[], string | string[]>
    | undefined
    | null = null;

  @Input() incomeExpensePerMonthChartData:
    | ChartData<'bar', number[], string | string[]>
    | undefined
    | null = null;

  @Input() expensesPerUserChartData:
    | ChartData<'line', number[], string | string[]>
    | undefined
    | null = null;

  @Input() dashboard: DashboardDto | undefined | null = null;

  @Input() filterRange: FilterRange | undefined | null = null;

  @Output() dateRangeChange = new EventEmitter<FilterRange>();

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

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: true,

    plugins: {
      legend: {
        display: true,
      },
    },
  };

  constructor(private chartFormattingService: ChartFormattingService) {}

  onDateRangeChange(event: FilterRange) {
    this.dateRangeChange.emit(event);
  }

  generateLegend(): {
    color: string;
    label: string | string[];
    value: number;
    percentage: number;
  }[] {
    if (
      !this.groupedExpensesChartData ||
      !this.groupedExpensesChartData.datasets[0] ||
      !this.groupedExpensesChartData.labels
    ) {
      return [];
    }
    return this.chartFormattingService.customiseLegend(
      this.groupedExpensesChartData,
    );
  }
}
