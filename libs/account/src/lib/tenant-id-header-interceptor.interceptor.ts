import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { first, Observable, switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AccountSelectors } from '../index';

@Injectable()
export class TenantIdHeaderInterceptorInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this.store.select(AccountSelectors.selectCurrentAccount).pipe(
      first(),
      switchMap((currentTenantId) => {
        if (currentTenantId) {
          console.log('currentTenantId', currentTenantId);
          request = request.clone({
            setHeaders: {
              'X-Tenant-ID': currentTenantId,
            },
          });
        }
        return next.handle(request);
      }),
    );
  }
}
