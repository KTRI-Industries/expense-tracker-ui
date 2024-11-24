import { ChartFormattingService } from './chart-formatting.service';
import { TooltipItem } from 'chart.js';
import '@angular/common/locales/global/el';
import { CurrencyPipe } from '@angular/common';

describe('ChartFormattingService', () => {
  let service: ChartFormattingService;
  let currencyPipe: CurrencyPipe;

  beforeEach(() => {
    currencyPipe = new CurrencyPipe('el-GR');
    service = new ChartFormattingService(currencyPipe);
  });

  function createTooltipItem(
    raw: number | null | undefined,
  ): TooltipItem<'doughnut'> {
    return {
      raw,
      chart: {} as any,
      label: '',
      parsed: 0,
      formattedValue: '',
      dataIndex: 0,
      datasetIndex: 0,
      dataset: {} as any,
      element: {} as any,
    };
  }

  it('formats tooltip label with valid value and currency', () => {
    const context = createTooltipItem(100);
    const result = service.formatTooltipLabel(context, 'EUR');
    expect(result).toBe('100,00\u00A0€');
  });

  it('formats tooltip label with zero value', () => {
    const context = createTooltipItem(0);
    const result = service.formatTooltipLabel(context, 'EUR');
    expect(result).toBe('0,00\u00A0€');
  });

  it('formats tooltip label with null value', () => {
    const context = createTooltipItem(null);
    const result = service.formatTooltipLabel(context, 'EUR');
    expect(result).toBe('0,00\u00A0€');
  });

  it('formats tooltip label with undefined value', () => {
    const context = createTooltipItem(undefined);
    const result = service.formatTooltipLabel(context, 'EUR');
    expect(result).toBe('0,00\u00A0€');
  });

  it('formats tooltip label with different currency', () => {
    const context = createTooltipItem(100);
    const result = service.formatTooltipLabel(context, 'USD');
    expect(result).toBe('100,00\u00A0$');
  });
});
