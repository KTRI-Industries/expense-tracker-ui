import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AppGuard } from './app.guard';
import { AuthActions } from './+state/auth.actions';

describe('AppGuard', () => {
  let guard: AppGuard;
  let keycloakService: KeycloakService;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppGuard,
        {
          provide: KeycloakService,
          useValue: { isLoggedIn: jest.fn() },
        },
        {
          provide: Store,
          useValue: { dispatch: jest.fn() },
        },
        {
          provide: Router,
          useValue: {},
        },
      ],
    });

    guard = TestBed.inject(AppGuard);
    keycloakService = TestBed.inject(KeycloakService);
    store = TestBed.inject(Store);
  });

  it('should force login if unauthenticated', async () => {
    jest.spyOn(keycloakService, 'isLoggedIn').mockReturnValue(false);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const result = await guard.isAccessAllowed(new ActivatedRouteSnapshot());

    expect(result).toBe(true);
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login());
  });

  it('should allow access if no additional roles are required', async () => {
    jest.spyOn(keycloakService, 'isLoggedIn').mockReturnValue(true);

    const result = await guard.isAccessAllowed(new ActivatedRouteSnapshot());

    expect(result).toBe(true);
  });

  it('should allow access if all required roles are present', async () => {
    jest.spyOn(keycloakService, 'isLoggedIn').mockReturnValue(true);
    guard['roles'] = ['role1', 'role2'];

    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['role1'] };

    const result = await guard.isAccessAllowed(route);

    expect(result).toBe(true);
  });

  it('should deny access if any required role is missing', async () => {
    jest.spyOn(keycloakService, 'isLoggedIn').mockReturnValue(true);
    guard['roles'] = ['role1'];

    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['role1', 'role2'] };

    const result = await guard.isAccessAllowed(route);

    expect(result).toBe(false);
  });
});
