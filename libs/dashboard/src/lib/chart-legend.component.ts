import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';

@Component({
  selector: 'expense-tracker-ui-chart-legend',
  imports: [CommonModule],
  templateUrl: './chart-legend.component.html',
  styles: [],
})
export class ChartLegendComponent {
  @Input() items: {
    color: string;
    label: string | string[];
    value: number;
    percentage: number;
  }[] = [];

  @Input() dashboard!: DashboardDto | undefined | null;
}
