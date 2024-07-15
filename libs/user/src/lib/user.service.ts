import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InvitedUserDto,
  TenantControllerService,
  UserControllerService,
  UserInfo,
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

  leaveTenant(tenantId: string): Observable<UserInfo> {
    return this.userApi.disassociateTenant({ tenantId });
  }

  associateTenant(tenantId: string): Observable<UserInfo> {
    return this.userApi.associateTenant({ tenantId });
  }
}
