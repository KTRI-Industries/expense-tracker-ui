import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-user-page
      [tenantUsers]="users$ | async"
      [isTenantOwner]="isTenantOwner$ | async"
      [email]="email$ | async"
      (delete)="onDelete($event)"></expense-tracker-ui-user-page>
  `,
  styles: ``,
})
export class UserPageContainerComponent {
  users$ = this.store.select(AuthSelectors.selectTenantUsers);
  isTenantOwner$ = this.store.select(AuthSelectors.selectIsTenantOwner);
  email$ = this.store.select(AuthSelectors.selectUserEmail);

  constructor(private store: Store) {}

  onDelete(userEmail: string) {
    this.store.dispatch(AuthActions.unInviteUser({ userEmail }));
  }
}
