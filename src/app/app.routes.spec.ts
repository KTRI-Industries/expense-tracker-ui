import { AppGuard } from '@expense-tracker-ui/shared/auth';
import { appRoutes } from './app.routes';

describe('appRoutes', () => {
  it('should configure the homepage route', () => {
    expect(appRoutes[0]).toEqual(
      expect.objectContaining({
        path: '',
      }),
    );
    expect(appRoutes[0].loadChildren).toEqual(expect.any(Function));
  });

  it('should protect the transactions page route with the users role', () => {
    expect(appRoutes[1]).toEqual(
      expect.objectContaining({
        path: 'transactions-page',
        canActivate: [AppGuard],
        data: {
          roles: ['users'],
        },
      }),
    );
    expect(appRoutes[1].loadChildren).toEqual(expect.any(Function));
  });

  it('should protect the user page route with the users role', () => {
    expect(appRoutes[2]).toEqual(
      expect.objectContaining({
        path: 'user-page',
        canActivate: [AppGuard],
        data: {
          roles: ['users'],
        },
      }),
    );
    expect(appRoutes[2].loadChildren).toEqual(expect.any(Function));
  });
});
