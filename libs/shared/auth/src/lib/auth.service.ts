import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TenantControllerService,
  TenantDto,
  TenantWithUserDetails,
  UserControllerService,
  UserInfo,
} from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tenantApi = inject(TenantControllerService); // TODO better way to reference the generated code?
  private userApi = inject(UserControllerService);

  generateTenant(email: string): Observable<TenantDto> {
    console.log(email);
    return this.tenantApi.generateTenant();
  }

  retrieveTenantUsers(): Observable<Array<UserInfo>> {
    return this.userApi.allUsers();
  }

  setDefaultTenant(tenantId: string) {
    return this.userApi.setDefaultTenant({ tenantId });
  }

  retrieveTenants(): Observable<Array<TenantWithUserDetails>> {
    return this.tenantApi.getUserTenants();
  }
}
