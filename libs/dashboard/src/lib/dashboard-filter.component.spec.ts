import '@testing-library/jest-dom';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { render, screen } from '@testing-library/angular';
import { fireEvent } from '@testing-library/dom';
import moment from 'moment';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { FilterRange } from './+state/dashboard.reducer';
import {
  createAppFormlyTestingImports,
  createAppFormlyTestingProviders,
} from '@expense-tracker-ui/testing/formly';

describe('DashboardFilterComponent', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  async function setup(model?: FilterRange | null) {
    const renderResult = await render(DashboardFilterComponent, {
      imports: [NoopAnimationsModule, ...createAppFormlyTestingImports()],
      providers: [...createAppFormlyTestingProviders()],
      componentProperties: model !== undefined ? { model } : {},
    });

    return renderResult;
  }

  it('renders the selected custom date range', async () => {
    const { container } = await setup({
      dateRange: 'custom',
      startDate: moment('2025-07-01'),
      endDate: moment('2025-07-15'),
    });

    expect(screen.getByText('from: 01/07/25')).toBeInTheDocument();
    expect(screen.getByText('to: 15/07/25')).toBeInTheDocument();
    expect(
      container.querySelector('[data-cy="dashboard-apply-filter-button"]'),
    ).toBeTruthy();
  });

  it('hides the apply action for non-custom ranges', async () => {
    await setup({
      dateRange: 'lastWeek',
    });

    expect(screen.queryByRole('link', { name: /apply/i })).toBeNull();
  });

  it.each([
    ['Last Week', '2026-03-08', '2026-03-15', 'lastWeek'],
    ['Last Month', '2026-02-15', '2026-03-15', 'lastMonth'],
    ['Last Year', '2025-03-15', '2026-03-15', 'lastYear'],
  ])(
    'emits the calculated %s range when selected from the UI',
    async (optionLabel, expectedStartDate, expectedEndDate, dateRange) => {
      jest.useFakeTimers().setSystemTime(new Date('2026-03-15T12:00:00Z'));
      const { container, fixture } = await setup({
        dateRange: 'custom',
        startDate: moment('2026-03-01'),
        endDate: moment('2026-03-05'),
      });
      const emitSpy = jest.spyOn(
        fixture.componentInstance.dateRangeChange,
        'emit',
      );

      fireEvent.click(
        container.querySelector(
          '[data-cy="dashboard-date-range-select"]',
        ) as HTMLElement,
      );
      fireEvent.click(await screen.findByText(optionLabel));

      const emittedRange = emitSpy.mock.calls[emitSpy.mock.calls.length - 1]?.[0] as FilterRange;

      expect(emittedRange.dateRange).toBe(dateRange);
      expect(emittedRange.startDate?.format('YYYY-MM-DD')).toBe(
        expectedStartDate,
      );
      expect(emittedRange.endDate?.format('YYYY-MM-DD')).toBe(expectedEndDate);
    },
  );

  it('emits the custom model when Apply is clicked', async () => {
    const startDate = moment('2025-07-01');
    const endDate = moment('2025-07-15');
    const { container, fixture } = await setup({
      dateRange: 'custom',
      startDate,
      endDate,
    });
    const emitSpy = jest.spyOn(fixture.componentInstance.dateRangeChange, 'emit');

    fireEvent.click(
      container.querySelector(
        '[data-cy="dashboard-apply-filter-button"]',
      ) as HTMLElement,
    );

    expect(emitSpy).toHaveBeenCalledWith({
      dateRange: 'custom',
      startDate,
      endDate,
    });
  });

  it('treats a null input model as an empty filter state', async () => {
    await setup(null);

    expect(screen.queryByRole('link', { name: /apply/i })).toBeNull();
    expect(screen.queryByText(/^from:/i)).toBeNull();
    expect(screen.queryByText(/^to:/i)).toBeNull();
  });
});
