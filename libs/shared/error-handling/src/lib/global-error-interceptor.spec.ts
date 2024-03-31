import { TestBed } from '@angular/core/testing';
import { GlobalErrorInterceptor } from './global-error-interceptor';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ErrorHandlingActions } from './+state/error-handling.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('ErrorInterceptorServiceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        // ...
        {
          provide: KeycloakService,
          useValue: {
            logout: jest.fn(),
          },
        },
        {
          provide: Store,
          useValue: {
            dispatch: jest.fn(),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn(),
          },
        },
      ],
    }),
  );

  it('should be created', () => {
    const service: GlobalErrorInterceptor = TestBed.get(GlobalErrorInterceptor);
    expect(service).toBeTruthy();
  });

  it('should dispatch action on 400', (done) => {
    const service: GlobalErrorInterceptor = TestBed.inject(
      GlobalErrorInterceptor,
    );
    const store = TestBed.inject(Store);
    const error = { status: 400 };
    const response = new HttpErrorResponse(error);
    const request = new HttpRequest('GET', 'test');
    const next = {
      handle: () => throwError(() => response),
    };
    service.intercept(request, next as any).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (err) => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ErrorHandlingActions.handleBackEndError({
            message: 'Unknown Error',
          }),
        );
        done();
      },
    );
  });

  it('should dispatch action with message from ProblemDetail', () => {
    const service: GlobalErrorInterceptor = TestBed.inject(
      GlobalErrorInterceptor,
    );
    const store = TestBed.inject(Store);
    const error = { status: 400, error: { detail: 'test error' } };
    const response = new HttpErrorResponse(error);
    const request = new HttpRequest('GET', 'test');
    const next = {
      handle: () => throwError(() => response),
    };
    service.intercept(request, next as any).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (err) => {
        expect(store.dispatch).toHaveBeenCalledWith(
          ErrorHandlingActions.handleBackEndError({
            message: 'test error',
          }),
        );
      },
    );
  });

  it('should logout on 401', (done) => {
    const service: GlobalErrorInterceptor = TestBed.inject(
      GlobalErrorInterceptor,
    );
    const keycloak = TestBed.inject(KeycloakService);
    const error = { status: 401 };
    const response = new HttpErrorResponse(error);
    const request = new HttpRequest('GET', 'test');
    const next = {
      handle: () => throwError(() => response),
    };
    service.intercept(request, next as any).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (err) => {
        expect(keycloak.logout).toHaveBeenCalled();
        done();
      },
    );
  });

  it('should show snackbar on 404', (done) => {
    const service: GlobalErrorInterceptor = TestBed.inject(
      GlobalErrorInterceptor,
    );
    const snackBar = TestBed.inject(MatSnackBar);
    const error = { status: 404 };
    const response = new HttpErrorResponse(error);
    const request = new HttpRequest('GET', 'test');
    const next = {
      handle: () => throwError(() => response),
    };
    service.intercept(request, next as any).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
      (err) => {
        expect(snackBar.open).toHaveBeenCalledWith('Unknown Error', 'Close', {
          duration: 10000,
        });
        done();
      },
    );
  });
});
