import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InvitedUserDto,
  KeycloakIntegrationControllerService,
  TenantControllerService,
  TenantDto,
  UserInfo,
} from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tenantApi = inject(TenantControllerService); // TODO better way to reference the generated code?
  private keycloakApi = inject(KeycloakIntegrationControllerService);

  generateTenant(email: string): Observable<TenantDto> {
    console.log(email);
    return this.tenantApi.generateTenant();
  }

  inviteUser(recipientEmail: string): Observable<InvitedUserDto> {
    return this.tenantApi.inviteUser({ recipientEmail });
  }

  retrieveTenantUsers(): Observable<Array<UserInfo>> {
    return this.keycloakApi.allUsers();
  }

  uninviteUser(guestEmail: string) {
    return this.tenantApi.uninviteUser({ guestEmail });
  }
}
