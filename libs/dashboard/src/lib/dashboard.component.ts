import { Component, Input } from '@angular/core';
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

  form: FormGroup;
  model: any = { dateRange: 'lastYear' }; // Set default value to 'lastYear'
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex flex-row space-x-4',
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
          },
        },
        {
          key: 'startDate',
          type: 'datepicker',
          props: {
            label: 'Start Date',
            placeholder: 'Pick start date',
          },
          hideExpression: (model) => model.dateRange !== 'custom',
        },
        {
          key: 'endDate',
          type: 'datepicker',
          props: {
            label: 'End Date',
            placeholder: 'Pick end date',
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
}
