import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InvitedUserDto,
  TenantControllerService,
  TenantDto,
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

  inviteUser(recipientEmail: string): Observable<InvitedUserDto> {
    return this.userApi.inviteUser({ recipientEmail });
  }

  retrieveTenantUsers(): Observable<Array<UserInfo>> {
    return this.userApi.allUsers();
  }

  uninviteUser(guestEmail: string) {
    return this.userApi.unInviteUser({ guestEmail });
  }
}
