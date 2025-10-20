import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { TenantWithUserDetails } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { AccountListComponent } from './account-list.component';
import { AccountActions } from './+state/account.actions';
import { AccountSelectors } from '../index';

@Component({
  selector: 'expense-tracker-ui-account-list-container',
  imports: [AsyncPipe, AccountListComponent],
  template: `
    <expense-tracker-ui-account-list
      [accounts]="accounts$ | async"
      [currentTenantId]="currentTenantId$ | async"
      (leaveAccount)="onLeaveAccount($event)"
      (associateUserWithAccount)="onAssociateUserWithAccount($event)"
      (switchAccount)="onSwitchAccount($event)"
      (setDefaultAccount)="onSetDefaultAccount($event)"
      (rejectInvite)="onRejectInvite($event)"></expense-tracker-ui-account-list>
  `,
  styles: ``,
})
export class AccountListContainerComponent implements OnInit {
  private store = inject(Store);

  accounts$: Observable<TenantWithUserDetails[]> = this.store.select(
    AccountSelectors.selectAccounts,
  );
  currentTenantId$: Observable<string> = this.store.select(
    AccountSelectors.selectCurrentAccount,
  );

  ngOnInit(): void {
    this.store.dispatch(AccountActions.retrieveAccounts());
  }

  onLeaveAccount($event: TenantWithUserDetails) {
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

  onRejectInvite($event: TenantWithUserDetails) {
    this.store.dispatch(AccountActions.rejectInvite({ tenantId: $event.id }));
  }
}
