import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';

@Component({
  selector: 'expense-tracker-ui-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  @Input() dashboard: DashboardDto | undefined;
}
