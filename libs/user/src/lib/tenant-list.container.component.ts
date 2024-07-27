import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';
import { UserActions } from './+state/user.actions';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { TenantListComponent } from './tenant-list.component';

@Component({
  selector: 'expense-tracker-ui-tenant-list-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe, TenantListComponent],
  template: `
    <expense-tracker-ui-tenant-list
      [tenants]="tenants$ | async"
      [currentTenantId]="currentTenantId$ | async"
      (leaveTenant)="onLeaveTenant($event)"
      (associateTenant)="onAssociateTenant($event)"
      (switchTenant)="onSwitchTenant($event)"
      (setDefaultTenant)="
        onSetDefaultTenant($event)
      "></expense-tracker-ui-tenant-list>
  `,
  styles: ``,
})
export class TenantListContainerComponent implements OnInit {
  tenants$: Observable<TenantWithUserDetails[]> = this.store.select(
    AuthSelectors.selectTenants,
  );
  currentTenantId$: Observable<string> = this.store.select(
    AuthSelectors.selectCurrentTenant,
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.retrieveTenants());
  }

  onLeaveTenant($event: TenantWithUserDetails) {
    this.store.dispatch(UserActions.leaveTenant({ tenantId: $event.id }));
  }

  onAssociateTenant($event: TenantWithUserDetails) {
    this.store.dispatch(UserActions.associateTenant({ tenantId: $event.id }));
  }

  onSwitchTenant($event: TenantWithUserDetails) {
    this.store.dispatch(AuthActions.switchTenant({ tenantId: $event.id }));
  }

  onSetDefaultTenant($event: TenantWithUserDetails) {
    this.store.dispatch(AuthActions.setDefaultTenant({ tenantId: $event.id }));
  }
}
