import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InvitedUserDto,
  TenantControllerService,
  TenantDto,
} from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(TenantControllerService); // TODO better way to reference the generated code?

  generateTenant(email: string): Observable<TenantDto> {
    console.log(email);
    return this.api.generateTenant();
  }

  inviteUser(recipientEmail: string): Observable<InvitedUserDto> {
    return this.api.inviteUser({ recipientEmail });
  }
}
