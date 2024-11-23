import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TooltipItem } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class ChartFormattingService {
  constructor(private currencyPipe: CurrencyPipe) {}

  formatTooltipLabel(
    context: TooltipItem<'doughnut'>,
    currency: string,
  ): string {
    const value = context.raw || 0;
    const formattedValue = this.currencyPipe.transform(
      value as number,
      currency,
    );
    return `${formattedValue}`;
  }
}
