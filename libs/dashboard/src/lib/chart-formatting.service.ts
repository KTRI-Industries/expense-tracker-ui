import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ChartFormattingService {
  constructor(private currencyPipe: CurrencyPipe) {}

  formatTooltipLabel(value: number, currency: string): string {
    return `${this.currencyPipe.transform(value, currency)}`;
  }
}
