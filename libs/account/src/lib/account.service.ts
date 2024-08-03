import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TenantControllerService,
  TenantWithUserDetails,
  UserControllerService,
  UserInfo,
} from '@expense-tracker-ui/shared/api';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private tenantApi = inject(TenantControllerService); // TODO better way to reference the generated code?
  private userApi = inject(UserControllerService);

  setDefaultAccount(tenantId: string) {
    return this.userApi.setDefaultTenant({ tenantId });
  }

  retrieveAccounts(): Observable<Array<TenantWithUserDetails>> {
    return this.tenantApi.getUserTenants();
  }

  associateUserWithAccount(tenantId: string): Observable<UserInfo> {
    return this.userApi.associateTenant({ tenantId });
  }

  leaveAccount(tenantId: string): Observable<UserInfo> {
    return this.userApi.disassociateTenant({ tenantId });
  }
}
