import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import { NavMenuComponent } from '@expense-tracker-ui/nav-menu';
import { AsyncPipe } from '@angular/common';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [RouterModule, NavMenuComponent, AsyncPipe, NgHttpLoaderModule],
  selector: 'expense-tracker-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  username$ = this.store.select(AuthSelectors.selectUserName);
  isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);
  isTenantOwner$ = this.store.select(AuthSelectors.selectIsTenantOwner);
  tenantId$ = this.store.select(AuthSelectors.selectTenantId);
  currentTenant$: Observable<string | undefined> = this.store.select(
    AuthSelectors.selectCurrentTenantOwnerEmail,
  );
  pendingInvitations$ = this.store.select(
    AuthSelectors.selectPendingInvitations,
  );

  title = 'expense-tracker-ui';

  constructor(
    private keycloak: KeycloakService,
    private store: Store,
  ) {}

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
