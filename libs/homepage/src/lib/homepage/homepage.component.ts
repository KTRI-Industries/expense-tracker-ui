import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';
import { LandingPageComponent } from './landing-page/landing-page.component';
import {
  DashboardActions,
  DashboardComponent,
  DashboardSelectors,
} from '@expense-tracker-ui/dashboard';
import { DashboardDto } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { ChartData } from 'chart.js';

@Component({
  selector: 'expense-tracker-ui-homepage',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    DashboardComponent,
    MatCard,
    MatCardTitle,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);
  dashboard$: Observable<DashboardDto | undefined | null> = this.store.select(
    DashboardSelectors.selectDashboard,
  );
  chartData$: Observable<ChartData<'doughnut', number[], string | string[]>> =
    this.store.select(DashboardSelectors.selectChartData);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(DashboardActions.initDashboard());
  }

  onLogin() {
    this.store.dispatch(AuthActions.login());
  }
}
