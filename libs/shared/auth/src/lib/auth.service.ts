import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  KeycloakIntegrationControllerService,
  TenantDto,
} from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(KeycloakIntegrationControllerService); // TODO better way to reference the generated code?

  generateTenant(email: string): Observable<TenantDto> {
    console.log(email);
    return this.api.generateTenant();
  }
}
