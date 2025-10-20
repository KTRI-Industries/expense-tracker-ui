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
}
