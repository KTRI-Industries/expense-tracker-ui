import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AuthActions } from './+state/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AppGuard extends KeycloakAuthGuard {
  protected override readonly router: Router;
  protected readonly keycloak: KeycloakService;
  private store = inject(Store);

  constructor() {
    const router = inject(Router);
    const keycloak = inject(KeycloakService);

    super(router, keycloak);
  
    this.router = router;
    this.keycloak = keycloak;
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
  ): Promise<boolean | UrlTree> {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      this.store.dispatch(AuthActions.login());
    }

    // Get the roles required from the route.
    const requiredRoles = route.data ? route.data['roles'] : undefined;


    // Allow the user to proceed if no additional roles are required to access the route.
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
