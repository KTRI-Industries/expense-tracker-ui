import { inject, Injectable } from '@angular/core';
import { APIS, UserInfo } from '@expense-tracker-ui/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakPlaygroundService {
  private api = inject(APIS[0]); // TODO better way to reference the generated code?

  getAdmin(): Observable<UserInfo> {
    return this.api.admin();
  }
}
