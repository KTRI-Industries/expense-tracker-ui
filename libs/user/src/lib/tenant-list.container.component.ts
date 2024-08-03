import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AsyncPipe } from '@angular/common';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { TenantListComponent } from './tenant-list.component';
import { AccountActions, AccountSelectors } from '@expense-tracker-ui/account';

@Component({
  selector: 'expense-tracker-ui-tenant-list-container',
  standalone: true,
  imports: [UserPageComponent, AsyncPipe, TenantListComponent],
  template: `
    <expense-tracker-ui-tenant-list
      [tenants]="accounts$ | async"
      [currentTenantId]="currentTenantId$ | async"
      (leaveTenant)="onLeaveTenant($event)"
      (associateUserWithAccount)="onAssociateUserWithAccount($event)"
      (switchAccount)="onSwitchAccount($event)"
      (setDefaultAccount)="
        onSetDefaultAccount($event)
      "></expense-tracker-ui-tenant-list>
  `,
  styles: ``,
})
export class TenantListContainerComponent implements OnInit {
  accounts$: Observable<TenantWithUserDetails[]> = this.store.select(
    AccountSelectors.selectAccounts,
  );
  currentTenantId$: Observable<string> = this.store.select(
    AccountSelectors.selectCurrentAccount,
  );

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(AccountActions.retrieveAccounts());
  }

  onLeaveTenant($event: TenantWithUserDetails) {
    this.store.dispatch(AccountActions.leaveAccount({ tenantId: $event.id }));
  }

  onAssociateUserWithAccount($event: TenantWithUserDetails) {
    this.store.dispatch(
      AccountActions.associateUserWithAccount({ tenantId: $event.id }),
    );
  }

  onSwitchAccount($event: TenantWithUserDetails) {
    this.store.dispatch(AccountActions.switchAccount({ tenantId: $event.id }));
  }

  onSetDefaultAccount($event: TenantWithUserDetails) {
    this.store.dispatch(
      AccountActions.setDefaultAccount({ tenantId: $event.id }),
    );
  }
}
