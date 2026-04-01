import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AppGuard } from './app.guard';
import { AuthActions } from './+state/auth.actions';

describe('AppGuard', () => {
  let guard: AppGuard;
  let store: jest.Mocked<Store>;

  function setGuardState(authenticated: boolean, roles: string[] = []) {
    Object.assign(guard as object, {
      authenticated,
      roles,
    });
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppGuard,
        {
          provide: KeycloakService,
          useValue: {},
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
    store = TestBed.inject(Store) as jest.Mocked<Store>;
  });

  it('should dispatch login when unauthenticated', async () => {
    setGuardState(false);

    await expect(guard.isAccessAllowed(new ActivatedRouteSnapshot())).resolves.toBe(
      true,
    );
    expect(store.dispatch).toHaveBeenCalledWith(AuthActions.login());
  });

  it('should allow access without dispatching login when already authenticated and no roles are required', async () => {
    setGuardState(true);

    await expect(guard.isAccessAllowed(new ActivatedRouteSnapshot())).resolves.toBe(
      true,
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('should allow access when all required roles are present', async () => {
    setGuardState(true, ['role1', 'role2']);

    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['role1'] };

    await expect(guard.isAccessAllowed(route)).resolves.toBe(true);
  });

  it('should deny access when a required role is missing', async () => {
    setGuardState(true, ['role1']);

    const route = new ActivatedRouteSnapshot();
    route.data = { roles: ['role1', 'role2'] };

    await expect(guard.isAccessAllowed(route)).resolves.toBe(false);
  });
});
