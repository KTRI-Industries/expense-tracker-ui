import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';
import { UserActions } from './+state/user.actions';
import { UserSelectors } from '@expense-tracker-ui/user';
import { TenantWithUserDetails, UserInfo } from '@expense-tracker-ui/api';
import { Observable } from 'rxjs';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-user-page
      [tenantUsers]="users$ | async"
      [isTenantOwner]="isTenantOwner$ | async"
      [email]="email$ | async"
      [tenants]="tenants$ | async"
      (delete)="onDelete($event)"
      (leaveTenant)="onLeaveTenant($event)"
      (associateTenant)="
        onAssociateTenant($event)
      "></expense-tracker-ui-user-page>
  `,
  styles: ``,
})
export class UserPageContainerComponent {
  users$: Observable<UserInfo[]> = this.store.select(
    AuthSelectors.selectTenantUsers,
  );
  isTenantOwner$ = this.store.select(AuthSelectors.selectIsTenantOwner);
  email$ = this.store.select(AuthSelectors.selectUserEmail);
  tenants$: Observable<TenantWithUserDetails[]> = this.store.select(
    UserSelectors.selectTenants,
  );

  constructor(private store: Store) {}

  onDelete(userEmail: string) {
    this.store.dispatch(UserActions.unInviteUser({ userEmail }));
  }

  onLeaveTenant($event: TenantWithUserDetails) {
    this.store.dispatch(UserActions.leaveTenant({ tenantId: $event.id }));
  }

  onAssociateTenant($event: TenantWithUserDetails) {
    this.store.dispatch(UserActions.associateTenant({ tenantId: $event.id }));
  }
}
