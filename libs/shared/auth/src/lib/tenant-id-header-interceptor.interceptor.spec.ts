import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { TenantIdHeaderInterceptorInterceptor } from './tenant-id-header-interceptor.interceptor';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('TenantIdHeaderInterceptorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TenantIdHeaderInterceptorInterceptor,
          multi: true,
        },
        {
          provide: Store,
          useValue: { select: jest.fn() },
        },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add X-Tenant-ID header when tenant id is available', () => {
    jest.spyOn(store, 'select').mockReturnValue(of('tenant-id'));

    httpClient.get('/api').subscribe();

    const httpRequest: TestRequest = httpMock.expectOne('/api');
    expect(httpRequest.request.headers.has('X-Tenant-ID')).toEqual(true);
    expect(httpRequest.request.headers.get('X-Tenant-ID')).toEqual('tenant-id');
  });

  it('should not add X-Tenant-ID header when tenant id is not available', () => {
    jest.spyOn(store, 'select').mockReturnValue(of(null));

    httpClient.get('/api').subscribe();

    const httpRequest: TestRequest = httpMock.expectOne('/api');
    expect(httpRequest.request.headers.has('X-Tenant-ID')).toEqual(false);
  });
});
