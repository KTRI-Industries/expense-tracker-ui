import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';
import { ChartThemeService } from './chart-theme.service';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { ChartLegendComponent } from './chart-legend.component';
import { FilterRange } from './+state/dashboard.reducer';

@Component({
  selector: 'expense-tracker-ui-dashboard',
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
export class DashboardComponent implements OnChanges {
  private chartFormattingService = inject(ChartFormattingService);
  private chartThemeService = inject(ChartThemeService);

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

  // Themed copies of the chart data — colours are injected from the active
  // CSS theme each time the underlying data changes.
  themedDoughnutData: ChartData<'doughnut', number[], string | string[]> | null = null;
  themedBarData: ChartData<'bar', number[], string | string[]> | null = null;
  themedLineData: ChartData<'line', number[], string | string[]> | null = null;

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
        display: false, // Disable the default legend — the custom ChartLegendComponent is used instead.
      },
    },
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  /**
   * Re-apply theme colours whenever any chart-data input changes.
   * Reading CSS variables here (after the DOM is ready) guarantees that
   * getComputedStyle() resolves the correct values for the active theme.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['groupedExpensesChartData']) {
      this.themedDoughnutData = this.applyDoughnutColors(
        this.groupedExpensesChartData,
      );
    }
    if (changes['incomeExpensePerMonthChartData']) {
      this.themedBarData = this.applyBarColors(
        this.incomeExpensePerMonthChartData,
      );
    }
    if (changes['expensesPerUserChartData']) {
      this.themedLineData = this.applyLineColors(this.expensesPerUserChartData);
    }
  }

  onDateRangeChange(event: FilterRange) {
    this.dateRangeChange.emit(event);
  }

  generateLegend(): {
    color: string;
    label: string | string[];
    value: number;
    percentage: number;
  }[] {
    // Use the themed copy so legend swatches match the doughnut slice colours.
    if (
      !this.themedDoughnutData ||
      !this.themedDoughnutData.datasets[0] ||
      !this.themedDoughnutData.labels
    ) {
      return [];
    }
    return this.chartFormattingService.customiseLegend(this.themedDoughnutData);
  }

  // ---------------------------------------------------------------------------
  // Private helpers — each one creates a new ChartData object with colours
  // injected, leaving the original input untouched.
  // ---------------------------------------------------------------------------

  /**
   * Assigns a cycling theme palette to the doughnut slices so each expense
   * category gets a distinct, on-brand colour rather than Chart.js defaults.
   * `borderWidth: 0` removes the white divider lines between thin slices.
   */
  private applyDoughnutColors(
    data: ChartData<'doughnut', number[], string | string[]> | undefined | null,
  ): ChartData<'doughnut', number[], string | string[]> | null {
    if (!data) return null;
    const count = data.datasets[0]?.data.length ?? 0;
    const palette = this.chartThemeService.getPalette(count);
    return {
      ...data,
      datasets: data.datasets.map((ds) => ({
        ...ds,
        backgroundColor: palette.slice(0, ds.data.length),
        // Remove inter-slice borders — they look cluttered on small slices.
        borderWidth: 0,
      })),
    };
  }

  /**
   * Colours the Income and Expense bar-chart series using the semantic
   * `--app-positive` / `--app-negative` tokens.  Semi-transparent fills (70 %)
   * with a solid border strike the right balance between readability and depth.
   * Dataset index 0 = Income, index 1 = Expense (matches the reducer order).
   */
  private applyBarColors(
    data: ChartData<'bar', number[], string | string[]> | undefined | null,
  ): ChartData<'bar', number[], string | string[]> | null {
    if (!data) return null;
    const { income, expense } = this.chartThemeService.getIncomeExpenseColors();
    const colorFor = (i: number) => (i === 0 ? income : expense);
    return {
      ...data,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        backgroundColor: this.chartThemeService.hexToRgba(colorFor(i), 0.7),
        borderColor: colorFor(i),
        borderWidth: 1,
      })),
    };
  }

  /**
   * Assigns one palette colour per user in the per-user expense line chart.
   * A very faint fill (15 % alpha) under each line preserves legibility when
   * multiple series overlap.
   */
  private applyLineColors(
    data: ChartData<'line', number[], string | string[]> | undefined | null,
  ): ChartData<'line', number[], string | string[]> | null {
    if (!data) return null;
    const palette = this.chartThemeService.getPalette(data.datasets.length);
    return {
      ...data,
      datasets: data.datasets.map((ds, i) => ({
        ...ds,
        borderColor: palette[i],
        // Faint area fill helps distinguish overlapping series without obscuring them.
        backgroundColor: this.chartThemeService.hexToRgba(palette[i], 0.15),
        pointBackgroundColor: palette[i],
      })),
    };
  }
}
