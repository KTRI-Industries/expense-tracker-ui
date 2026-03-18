import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPageComponent } from './user-page.component';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { AsyncPipe } from '@angular/common';
import { UserActions } from './+state/user.actions';
import { UserInfo } from '@expense-tracker-ui/shared/api';
import { Observable } from 'rxjs';
import { AccountSelectors } from '@expense-tracker-ui/account';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  imports: [UserPageComponent, AsyncPipe],
  template: `
    <expense-tracker-ui-user-page
      [tenantUsers]="users$ | async"
      [isAccountOwner]="isAccountOwner$ | async"
      [email]="email$ | async"
      (delete)="onDelete($event)"
      (manageSecurity)="onManageSecurity()"></expense-tracker-ui-user-page>
  `,
  styles: ``,
})
export class UsersContainerComponent implements OnInit {
  private store = inject(Store);
  private keycloak = inject(KeycloakService);

  users$: Observable<UserInfo[]> = this.store.select(
    AuthSelectors.selectTenantUsers,
  );
  isAccountOwner$ = this.store.select(
    AccountSelectors.selectIsUserCurrentAccountOwner,
  );
  email$ = this.store.select(AuthSelectors.selectUserEmail);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.retrieveTenantUsers());
  }

  onDelete(userEmail: string) {
    this.store.dispatch(UserActions.unInviteUser({ userEmail }));
  }

  onManageSecurity() {
    const url = this.keycloak.getKeycloakInstance().createAccountUrl();
    const accountIndex = url.indexOf('/account');
    const base = url.substring(0, accountIndex + '/account'.length);
    const query = url.includes('?') ? url.substring(url.indexOf('?')) : '';
    const securityUrl = `${base}/account-security/signing-in${query}`;
    window.open(securityUrl, '_blank', 'noopener,noreferrer');
  }
}
