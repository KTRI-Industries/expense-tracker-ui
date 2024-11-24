import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';

@Component({
  selector: 'expense-tracker-ui-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    BaseChartDirective,
  ],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  private _dashboard: DashboardDto | undefined | null = null;

  @Input()
  set dashboard(value: DashboardDto | undefined | null) {
    this._dashboard = value;
    this.updateChartData();
  }

  get dashboard(): DashboardDto | undefined | null {
    return this._dashboard;
  }

  constructor(private chartFormattingService: ChartFormattingService) {}

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

  public doughnutChartData: ChartData<'doughnut', number[], string | string[]> =
    {
      labels: [],
      datasets: [
        {
          data: [],
        },
      ],
    };

  private updateChartData(): void {
    this.doughnutChartData = {
      labels: this.dashboard?.expenseByCategory?.labels || [],
      datasets: [
        {
          data:
            this.dashboard?.expenseByCategory.values.map(
              (value) => value.amount as number,
            ) || [],
        },
      ],
    };
  }
}
