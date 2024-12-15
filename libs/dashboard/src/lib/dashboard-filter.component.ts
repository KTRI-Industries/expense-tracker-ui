import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import moment, { Moment } from 'moment';
import { CommonModule } from '@angular/common';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'expense-tracker-ui-dashboard-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, MatAnchor],
  templateUrl: './dashboard-filter.component.html',
  styleUrls: ['./dashboard-filter.component.css'],
})
export class DashboardFilterComponent implements OnInit {
  @Output() dateRangeChange = new EventEmitter<{
    startDate: Moment;
    endDate: Moment;
  }>();

  form: FormGroup;
  model: any = {
    dateRange: 'lastYear',
    startDate: moment().subtract(1, 'year'),
    endDate: moment(),
  }; // Set default values
  options: FormlyFormOptions = {};
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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    this.dateRangeChange.emit({
      startDate: this.model.startDate,
      endDate: this.model.endDate,
    });
  }

  private changeDateDropDown(value: string) {
    switch (value) {
      case 'lastWeek':
        this.dateRangeChange.emit(this.getLastWeekStartEndDates());
        break;
      case 'lastMonth':
        this.dateRangeChange.emit(this.getLastMonthStartDateEndDates());
        break;
      case 'lastYear':
        this.dateRangeChange.emit(this.getLastYearStartDateEndDates());
        break;
    }
  }

  private getLastWeekStartEndDates() {
    const today = moment();
    const lastWeekStart = moment().subtract(7, 'days');
    return {
      startDate: lastWeekStart,
      endDate: today,
    };
  }

  private getLastMonthStartDateEndDates() {
    const today = moment();
    const lastMonthStart = moment().subtract(1, 'month');
    return {
      startDate: lastMonthStart,
      endDate: today,
    };
  }

  private getLastYearStartDateEndDates() {
    const today = moment();
    const lastYearStart = moment().subtract(1, 'year');
    return {
      startDate: lastYearStart,
      endDate: today,
    };
  }

  isCustomFilter() {
    return this.model.dateRange === 'custom';
  }

  applyCustomFilter(event: Event) {
    event.preventDefault();
    this.dateRangeChange.emit({
      startDate: this.model.startDate,
      endDate: this.model.endDate,
    });
  }
}
