import { ChartFormattingService } from './chart-formatting.service';
import '@angular/common/locales/global/el';
import { CurrencyPipe } from '@angular/common';

describe('ChartFormattingService', () => {
  let service: ChartFormattingService;
  let currencyPipe: CurrencyPipe;

  beforeEach(() => {
    currencyPipe = new CurrencyPipe('el-GR');
    service = new ChartFormattingService();
  });

  it('formats tooltip label with valid value and currency', () => {
    const result = service.formatTooltipLabel(100, 'EUR');
    expect(result).toBe('100,00\u00A0€');
  });

  it('formats tooltip label with zero value', () => {
    const result = service.formatTooltipLabel(0, 'EUR');
    expect(result).toBe('0,00\u00A0€');
  });

  it('formats tooltip label with different currency', () => {
    const result = service.formatTooltipLabel(100, 'USD');
    expect(result).toBe('100,00\u00A0$');
  });
});
