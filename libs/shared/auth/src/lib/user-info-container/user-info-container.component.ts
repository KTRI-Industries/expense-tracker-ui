import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  AuthActions,
  AuthSelectors,
  TenantAwareKeycloakProfile,
} from '../../index';
import { UserInfoComponent } from '../user-info/user-info.component';
import { Observable } from 'rxjs';

@Component({
  imports: [CommonModule, UserInfoComponent],
  selector: 'expense-tracker-ui-user-info-container',
  template: `
    <expense-tracker-ui-user-info
      [isLoggedIn]="isLoggedIn$ | async"
      [userProfile]="userProfile$ | async"
      (login)="onLogin()"
      (logout)="onLogout()"></expense-tracker-ui-user-info>
  `,
})
export class UserInfoContainerComponent {
  private store = inject(Store);

  isLoggedIn$ = this.store.select(AuthSelectors.selectIsLoggedIn);
  userProfile$: Observable<TenantAwareKeycloakProfile | null> =
    this.store.select(AuthSelectors.selectUserProfile);

  public onLogin() {
    this.store.dispatch(AuthActions.login());
  }

  public onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
