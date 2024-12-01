import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartFormattingService } from './chart-formatting.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import { MatButton } from '@angular/material/button';
import moment, { Moment } from 'moment';

@Component({
  selector: 'expense-tracker-ui-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    BaseChartDirective,
    ReactiveFormsModule,
    FormlyModule,
    MatButton,
  ],
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent {
  @Input() chartData:
    | ChartData<'doughnut', number[], string | string[]>
    | undefined
    | null = null;

  @Input() dashboard: DashboardDto | undefined | null = null;

  @Output() dateRangeChange = new EventEmitter<{
    startDate: Moment;
    endDate: Moment;
  }>();

  form: FormGroup;
  model: any = { dateRange: 'lastYear' }; // Set default value to 'lastYear'
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      // in large screens, display the form fields in a row
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
            subscriptSizing: 'dynamic',
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
            subscriptSizing: 'dynamic',
            /*change: (field, event) => {
              this.dateRangeChange.emit({
                startDate: event.value,
                endDate: new Date(),
              });
            },*/
          },
          hideExpression: (model) => model.dateRange !== 'custom',
        },
        {
          key: 'endDate',
          type: 'datepicker',
          props: {
            label: 'End Date',
            placeholder: 'Pick end date',
            subscriptSizing: 'dynamic',
            /*  change: (field, event) => {
              this.dateRangeChange.emit({
                startDate: new Date(),
                endDate: event.value,
              });
            },*/
          },
          hideExpression: (model) => model.dateRange !== 'custom',
        },
      ],
    },
  ];

  constructor(
    private chartFormattingService: ChartFormattingService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({});
  }

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) =>
            this.chartFormattingService.formatTooltipLabel(
              context,
              this.dashboard?.mainTransactionData?.totalExpense?.currency ||
                'EUR',
            ),
        },
      },
    },
  };

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

  applyCustomFilter() {
    this.dateRangeChange.emit({
      startDate: this.model.startDate,
      endDate: this.model.endDate,
    });
  }
}
