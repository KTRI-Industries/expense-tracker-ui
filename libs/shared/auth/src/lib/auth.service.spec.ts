import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import {
  KeycloakIntegrationControllerService,
  TenantDto,
} from '@expense-tracker-ui/api';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let api: KeycloakIntegrationControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: KeycloakIntegrationControllerService,
          useValue: { generateTenant: jest.fn() },
        },
      ],
    });

    service = TestBed.inject(AuthService);
    api = TestBed.inject(KeycloakIntegrationControllerService);
  });

  it('should generate tenant successfully', fakeAsync(() => {
    const tenant = { id: '123' }; // replace with actual tenant data
    const email = 'john@example.com';

    // this is not great, but it's the only way to mock overloaded methods with jest...
    (
      jest.spyOn(api, 'generateTenant') as unknown as jest.SpyInstance<
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
      jest.spyOn(api, 'generateTenant') as unknown as jest.SpyInstance<
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
