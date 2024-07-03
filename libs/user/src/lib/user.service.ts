import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InvitedUserDto,
  TenantControllerService,
  TenantDto,
  UserControllerService,
  UserInfo
} from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userApi = inject(UserControllerService);
  private tenantApi = inject(TenantControllerService);


  retrieveTenantUsers(): Observable<Array<UserInfo>> {
    return this.userApi.allUsers();
  }

  inviteUser(recipientEmail: string): Observable<InvitedUserDto> {
    return this.userApi.inviteUser({ recipientEmail });
  }

  unInviteUser(guestEmail: string) {
    return this.userApi.unInviteUser({ guestEmail });
  }


  leaveTenant(tenantId: string) {
    return this.tenantApi.disassociateTenant({ tenantId });
  }

  associateTenant(tenantId: string): Observable<TenantDto> {
    return this.tenantApi.associateTenant({ tenantId });
  }
}
