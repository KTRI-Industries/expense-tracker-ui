import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import {
  TenantControllerService,
  TenantDto,
  UserControllerService,
} from '@expense-tracker-ui/shared/api';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let tenantApi: TenantControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: TenantControllerService,
          useValue: { generateTenant: jest.fn() },
        },
        {
          provide: UserControllerService,
          useValue: { allUsers: jest.fn() },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    tenantApi = TestBed.inject(TenantControllerService);
  });

  it('should generate tenant successfully', fakeAsync(() => {
    const tenant = { id: '123' }; // replace with actual tenant data
    const email = 'john@example.com';

    // this is not great, but it's the only way to mock overloaded methods with jest...
    (
      jest.spyOn(tenantApi, 'generateTenant') as unknown as jest.SpyInstance<
        Observable<TenantDto>
      >
    ).mockReturnValue(of(tenant));

    let result: TenantDto | undefined;
    service.generateTenant(email).subscribe((res) => {
      result = res;
    });

    tick();

    expect(result).toEqual(tenant);
  }));

  it('should handle error when generating tenant fails', fakeAsync(() => {
    const error = new Error('Tenant generation failed');
    const email = 'john@example.com';

    (
      jest.spyOn(tenantApi, 'generateTenant') as unknown as jest.SpyInstance<
        Observable<TenantDto>
      >
    ).mockReturnValue(throwError(error));

    let resultError: Error | undefined;
    service.generateTenant(email).subscribe(undefined, (err) => {
      resultError = err;
    });

    tick();

    expect(resultError).toEqual(error);
  }));
});
