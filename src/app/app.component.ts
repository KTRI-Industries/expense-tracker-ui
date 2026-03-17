import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { NavMenuComponent } from '@expense-tracker-ui/nav-menu';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ErrorHandlingComponent } from '@expense-tracker-ui/shared/error-handling';
import { AccountSelectors } from '@expense-tracker-ui/account';
import { NgHttpLoaderComponent } from 'ng-http-loader';

@Component({
  imports: [
    RouterModule,
    NavMenuComponent,
    AsyncPipe,
    NgHttpLoaderComponent,
    ErrorHandlingComponent,
  ],
  selector: 'expense-tracker-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private keycloak = inject(KeycloakService);
  private store = inject(Store);

  username$ = this.store.select(AuthSelectors.selectUserName);
  email$ = this.store.select(AuthSelectors.selectUserEmail);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);
  isUserAccountOwner$ = this.store.select(
    AccountSelectors.selectIsUserCurrentAccountOwner,
  );
  tenantId$ = this.store.select(AuthSelectors.selectTenantId);
  currentAccount$: Observable<string | undefined> = this.store.select(
    AccountSelectors.selectCurrentAccountOwnerEmail,
  );
  pendingAccountInvitations$ = this.store.select(
    AccountSelectors.selectPendingAccountInvitations,
  );

  title = 'expense-tracker-ui';

  ngOnInit(): void {
    this.store.dispatch(AuthActions.checkLogin());
  }

  onLogin() {
    this.store.dispatch(AuthActions.login());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  onManageSecurity() {
    const url = this.keycloak.getKeycloakInstance().createAccountUrl();
    // createAccountUrl() returns: /account?referrer=... (no trailing slash in Keycloak 26)
    // Keycloak 26 Account Console uses path routing, not hash routing
    const accountIndex = url.indexOf('/account');
    const base = url.substring(0, accountIndex + '/account'.length);
    const query = url.includes('?') ? url.substring(url.indexOf('?')) : '';
    const securityUrl = `${base}/account-security/signing-in${query}`;
    window.open(securityUrl, '_blank');
  }
}
