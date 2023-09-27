import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  AuthActions,
  AuthSelectors,
} from '@expense-tracker-ui/shared/auth/data-access';
import { UserInfoComponent } from '@expense-tracker-ui/shared/auth/ui-auth';

@Component({
  imports: [CommonModule, UserInfoComponent],
  selector: 'expense-tracker-ui-user-info-container',
  template: `<expense-tracker-ui-user-info
    [isLoggedIn]="isLoggedIn$ | async"
    [userProfile]="userProfile$ | async"
    (login)="onLogin()"
    (logout)="onLogout()"
  ></expense-tracker-ui-user-info>`,
  standalone: true,
})
export class UserInfoContainerComponent {
  isLoggedIn$ = this.store.select(AuthSelectors.selectIsLoggedIn);
  userProfile$ = this.store.select(AuthSelectors.selectUserProfile);

  constructor(private store: Store) {}

  public onLogin() {
    this.store.dispatch(AuthActions.login());
  }

  public onLogout() {
    this.store.dispatch(AuthActions.logout());
  }
}
