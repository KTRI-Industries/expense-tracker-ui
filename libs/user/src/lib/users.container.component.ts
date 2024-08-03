import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';
import { UserActions } from './+state/user.actions';
import { UserInfo } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { AccountSelectors } from '@expense-tracker-ui/account';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-user-page
      [tenantUsers]="users$ | async"
      [isAccountOwner]="isAccountOwner$ | async"
      [email]="email$ | async"
      (delete)="onDelete($event)"></expense-tracker-ui-user-page>
  `,
  styles: ``,
})
export class UsersContainerComponent implements OnInit {
  users$: Observable<UserInfo[]> = this.store.select(
    AuthSelectors.selectTenantUsers,
  );
  isAccountOwner$ = this.store.select(
    AccountSelectors.selectIsUserCurrentAccountOwner,
  );
  email$ = this.store.select(AuthSelectors.selectUserEmail);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.retrieveTenantUsers());
  }

  onDelete(userEmail: string) {
    this.store.dispatch(UserActions.unInviteUser({ userEmail }));
  }
}
