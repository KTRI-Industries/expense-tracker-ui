import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { DashboardContainerComponent } from '@expense-tracker-ui/dashboard';

@Component({
  selector: 'expense-tracker-ui-homepage',
  imports: [CommonModule, LandingPageComponent, DashboardContainerComponent],
  templateUrl: './homepage.component.html',
})
export class HomepageComponent {
  private store = inject(Store);

  isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);

  onLogin() {
    this.store.dispatch(AuthActions.login());
  }
}
