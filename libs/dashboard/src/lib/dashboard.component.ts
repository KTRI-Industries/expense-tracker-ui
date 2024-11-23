import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';

@Component({
  selector: 'expense-tracker-ui-dashboard',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardTitle, MatCardContent],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent {
  @Input() dashboard: DashboardDto | undefined | null;
}
