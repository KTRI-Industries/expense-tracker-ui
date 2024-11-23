import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Category, DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartData, ChartOptions, TooltipItem } from 'chart.js';
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
  @Input() dashboard: DashboardDto | undefined | null;

  totalExpenseData: ExpenseCategories = {
    labels: [
      Category.Restaurant,
      Category.Rent,
      Category.Groceries,
      Category.Bill,
      Category.Taxes,
    ],
    values: [10320, 2020, 2002, 2222, 5565],
  };

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
      labels: this.totalExpenseData.labels || [],
      datasets: [
        {
          data: this.totalExpenseData.values || [],
        },
      ],
    };

  formatTooltipLabel(context: TooltipItem<'doughnut'>): string {
    const value = context.raw || 0;
    const currency =
      this.dashboard?.mainTransactionData?.totalExpense?.currency || 'EUR';
    const formattedValue = this.currencyPipe.transform(
      value as number,
      currency,
    );
    return `${formattedValue}`;
  }

  constructor(
    private currencyPipe: CurrencyPipe,
    private chartFormattingService: ChartFormattingService,
  ) {}
}

interface ExpenseCategories {
  labels: string[];
  values: number[];
}
