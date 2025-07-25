import { fireEvent, render, RenderResult, screen } from '@testing-library/angular';
import { DashboardFilterComponent } from './dashboard-filter.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterRange } from './+state/dashboard.reducer';
import moment from 'moment';
import '@testing-library/jest-dom';

describe('DashboardFilterComponent', () => {
  let component: RenderResult<DashboardFilterComponent>;

  async function setupComponent(model?: FilterRange | null) {
    return render(DashboardFilterComponent, {
      imports: [
        CommonModule,
        ReactiveFormsModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        MatButtonModule,
        MatNativeDateModule,
        NoopAnimationsModule,
        FormlyModule.forRoot({
          validationMessages: [
            { name: 'required', message: 'This field is required' }
          ]
        })
      ],
      componentProperties: model !== undefined ? { model } : {}
    });
  }

  it('should create DashboardFilterComponent', async () => {
    component = await setupComponent();
    expect(component.fixture.componentInstance).toBeTruthy();
  });

  it('should display date range when model has dates', async () => {
    const start = moment('2025-07-01');
    const end = moment('2025-07-15');
    const model: FilterRange = { dateRange: 'custom', startDate: start, endDate: end };

    component = await setupComponent(model);

    expect(screen.getByText('from: 01/07/25')).toBeInTheDocument();
    expect(screen.getByText('to: 15/07/25')).toBeInTheDocument();
  });

  it('should not show Apply button when dateRange is not custom', async () => {
    const model: FilterRange = { dateRange: 'lastWeek' };
    component = await setupComponent(model);

    expect(screen.queryByText('Apply')).not.toBeInTheDocument();
  });

  it('should show Apply button when dateRange is custom', async () => {
    const model: FilterRange = { dateRange: 'custom', startDate: moment(), endDate: moment() };
    component = await setupComponent(model);

    expect(screen.getByText('Apply')).toBeInTheDocument();
  });

  it('should calculate correct date range for lastWeek', async () => {
    component = await setupComponent();
    const instance = component.fixture.componentInstance;
    const spy = jest.spyOn(instance.dateRangeChange, 'emit');

    // Test the actual date calculation logic
    const lastWeekRange = instance['getLastWeekStartEndDates']();
    const expectedStart = moment().subtract(7, 'days');
    const expectedEnd = moment();

    expect(lastWeekRange.startDate.format('YYYY-MM-DD')).toBe(expectedStart.format('YYYY-MM-DD'));
    expect(lastWeekRange.endDate.format('YYYY-MM-DD')).toBe(expectedEnd.format('YYYY-MM-DD'));
  });

  it('should calculate correct date range for lastMonth', async () => {
    component = await setupComponent();
    const instance = component.fixture.componentInstance;

    const lastMonthRange = instance['getLastMonthStartDateEndDates']();
    const expectedStart = moment().subtract(1, 'month');
    const expectedEnd = moment();

    expect(lastMonthRange.startDate.format('YYYY-MM-DD')).toBe(expectedStart.format('YYYY-MM-DD'));
    expect(lastMonthRange.endDate.format('YYYY-MM-DD')).toBe(expectedEnd.format('YYYY-MM-DD'));
  });

  it('should calculate correct date range for lastYear', async () => {
    component = await setupComponent();
    const instance = component.fixture.componentInstance;

    const lastYearRange = instance['getLastYearStartDateEndDates']();
    const expectedStart = moment().subtract(1, 'year');
    const expectedEnd = moment();

    expect(lastYearRange.startDate.format('YYYY-MM-DD')).toBe(expectedStart.format('YYYY-MM-DD'));
    expect(lastYearRange.endDate.format('YYYY-MM-DD')).toBe(expectedEnd.format('YYYY-MM-DD'));
  });

  it('should emit dateRangeChange with correct dates when Apply button is clicked', async () => {
    const start = moment('2025-07-01');
    const end = moment('2025-07-15');
    const customModel: FilterRange = { dateRange: 'custom', startDate: start, endDate: end };

    component = await setupComponent(customModel);
    const instance = component.fixture.componentInstance;
    const spy = jest.spyOn(instance.dateRangeChange, 'emit');

    fireEvent.click(screen.getByText('Apply'));

    expect(spy).toHaveBeenCalledWith({
      dateRange: 'custom',
      startDate: start,
      endDate: end
    });
  });

  it('should return true for isCustomFilter when dateRange is custom', async () => {
    const customModel: FilterRange = { dateRange: 'custom', startDate: moment(), endDate: moment() };
    component = await setupComponent(customModel);
    const instance = component.fixture.componentInstance;

    expect(instance.isCustomFilter()).toBe(true);
  });

  it('should return false for isCustomFilter when dateRange is not custom', async () => {
    const model: FilterRange = { dateRange: 'lastWeek' };
    component = await setupComponent(model);
    const instance = component.fixture.componentInstance;

    expect(instance.isCustomFilter()).toBe(false);
  });

  it('should handle null model gracefully', async () => {
    component = await setupComponent(null);
    const instance = component.fixture.componentInstance;

    expect(instance.model).toBeUndefined();
    expect(instance.isCustomFilter()).toBe(false);
  });
});
