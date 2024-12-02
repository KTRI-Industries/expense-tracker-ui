import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ChartData, ChartType } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartFormattingService {
  constructor(private currencyPipe: CurrencyPipe) {}

  formatTooltipLabel(value: number, currency: string): string {
    return `${this.currencyPipe.transform(value, currency)}`;
  }

  customiseLegend<T extends ChartType>(
    chartData: ChartData<T, number[], string | string[]>,
  ): ChartLegendItem[] {
    const dataset = chartData.datasets[0];
    const totalValue: number = dataset.data.reduce(
      (sum: number, value: number) => sum + value,
      0,
    );

    // Ensure backgroundColor is treated as an array
    const backgroundColors = Array.isArray(dataset.backgroundColor)
      ? (dataset.backgroundColor as string[])
      : [];

    const legendItems: ChartLegendItem[] =
      chartData.labels?.map((label, index) => ({
        label: label as string,
        value: dataset.data[index],
        color: backgroundColors[index],
        percentage: totalValue ? (dataset.data[index] / totalValue) * 100 : 0,
      })) || [];

    // Sort legend items in descending order based on percentage
    return legendItems.sort((a, b) => b.percentage - a.percentage);
  }
}

export interface ChartLegendItem {
  color: string;
  label: string;
  value: number;
  percentage: number;
}
