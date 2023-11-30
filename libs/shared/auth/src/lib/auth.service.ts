import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIS, Tenant } from '@expense-tracker-ui/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(APIS[0]); // TODO better way to reference the generated code?

  generateTenant(email: string): Observable<Tenant> {
    console.log(email);
    return this.api.generateTenant(email);
  }
}
