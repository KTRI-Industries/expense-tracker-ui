import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { DashboardContainerComponent } from '@expense-tracker-ui/dashboard';

@Component({
  selector: 'expense-tracker-ui-homepage',
  standalone: true,
  imports: [
    CommonModule,
    LandingPageComponent,
    DashboardContainerComponent,
    MatCard,
    MatCardTitle,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);

  constructor(private store: Store) {}

  onLogin() {
    this.store.dispatch(AuthActions.login());
  }
}
