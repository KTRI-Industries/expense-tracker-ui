import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import moment from 'moment';

import { MatAnchor } from '@angular/material/button';
import { FilterRange } from './+state/dashboard.reducer';

@Component({
  selector: 'expense-tracker-ui-dashboard-filter',
  imports: [ReactiveFormsModule, FormlyModule, MatAnchor],
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css'],
})
export class DashboardFilterComponent {
  private fb = inject(FormBuilder);

  private _model: FilterRange | undefined;

  @Input()
  set model(value: FilterRange | null | undefined) {
    this._model = value ? { ...value } : undefined;
  }

  get model(): FilterRange | null | undefined {
    return this._model;
  }

  @Output() dateRangeChange = new EventEmitter<FilterRange>();

  form: FormGroup;

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'lg:flex lg:flex-row lg:space-x-4',
      fieldGroup: [
        {
          key: 'dateRange',
          type: 'select',
          props: {
            label: 'Select Date Range',
            options: [
              { value: 'lastWeek', label: 'Last Week' },
              { value: 'lastMonth', label: 'Last Month' },
              { value: 'lastYear', label: 'Last Year' },
              { value: 'custom', label: 'Custom Date Range' },
            ],
            subscriptSizing: 'dynamic', // used to remove the subscript error div
            change: (field, event) => {
              this.changeDateDropDown(event.value);
            },
          },
        },
        {
          key: 'startDate',
          type: 'datepicker',
          props: {
            label: 'Start Date',
            placeholder: 'Pick start date',
            subscriptSizing: 'dynamic', // used to remove the subscript error div
          },
          expressions: {
            hide: (model) => model.model.dateRange !== 'custom',
          },
        },
        {
          key: 'endDate',
          type: 'datepicker',
          props: {
            label: 'End Date',
            placeholder: 'Pick end date',
            subscriptSizing: 'dynamic',
          },
          expressions: {
            hide: (model) => model.model.dateRange !== 'custom',
          },
        },
      ],
    },
  ];

  constructor() {
    this.form = this.fb.group({});
  }

  private changeDateDropDown(value: string) {
    let dateRange;
    switch (value) {
      case 'lastWeek':
        dateRange = this.getLastWeekStartEndDates();
        break;
      case 'lastMonth':
        dateRange = this.getLastMonthStartDateEndDates();
        break;
      case 'lastYear':
        dateRange = this.getLastYearStartDateEndDates();
        break;
      case 'custom':
        // Do nothing for custom, as dates are manually selected
        return;
    }
    if (dateRange) {
      this.model = {
        ...this.model,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
      this.dateRangeChange.emit(dateRange);
    }
  }

  private getLastWeekStartEndDates() {
    const today = moment();
    const lastWeekStart = moment().subtract(7, 'days');
    return {
      startDate: lastWeekStart,
      endDate: today,
      dateRange: this.model?.dateRange,
    };
  }

  private getLastMonthStartDateEndDates() {
    const today = moment();
    const lastMonthStart = moment().subtract(1, 'month');
    return {
      startDate: lastMonthStart,
      endDate: today,
      dateRange: this.model?.dateRange,
    };
  }

  private getLastYearStartDateEndDates() {
    const today = moment();
    const lastYearStart = moment().subtract(1, 'year');
    return {
      startDate: lastYearStart,
      endDate: today,
      dateRange: this.model?.dateRange,
    };
  }

  isCustomFilter() {
    return this.model?.dateRange === 'custom';
  }

  applyCustomFilter(event: Event) {
    event.preventDefault();
    this.dateRangeChange.emit({
      startDate: this.model?.startDate,
      endDate: this.model?.endDate,
      dateRange: this.model?.dateRange,
    });
  }
}
