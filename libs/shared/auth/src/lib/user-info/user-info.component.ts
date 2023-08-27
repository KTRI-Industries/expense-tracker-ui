import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AuthActions } from '../+state/auth.actions';
import { selectIsLoggedIn, selectUserProfile } from '../+state/auth.selectors';

@Component({
  imports: [CommonModule],
  selector: 'expense-tracker-ui-user-info',
  templateUrl: './user-info.component.html',
  standalone: true,
})
export class UserInfoComponent {
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  userProfile$ = this.store.select(selectUserProfile);

  constructor(
    private readonly keycloak: KeycloakService,
    private store: Store
  ) {}

  public login() {
    this.store.dispatch(AuthActions.login());
  }

  public logout() {
    this.keycloak.logout();
  }
}
