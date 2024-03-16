import { catchError, Observable, throwError } from 'rxjs';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';

export class GlobalErrorInterceptor implements HttpInterceptor {
  constructor(
    private snackBar: MatSnackBar,
    private keycloak: KeycloakService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        switch (error.status) {
          case 401:
          case 403:
            this.keycloak.logout(); // one scenario to get here is when the refresh token is expired
            break;
          case 404:
          default:
            this.snackBar.open(error.statusText, 'Close', {
              duration: 10000,
            });
            break;
        }
        return throwError(() => error);
      }),
    );
  }
}
