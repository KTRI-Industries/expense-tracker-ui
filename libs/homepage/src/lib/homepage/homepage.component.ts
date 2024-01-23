import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { Store } from '@ngrx/store';
import { LandingPageComponent } from './landing-page/landing-page.component';

@Component({
  selector: 'expense-tracker-ui-homepage',
  standalone: true,
  imports: [CommonModule, MatButton, RouterLink, LandingPageComponent],
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
