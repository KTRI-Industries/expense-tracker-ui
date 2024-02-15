import { inject, Injectable } from '@angular/core';
import {
  APIS,
  KeycloakIntegrationControllerService,
  UserInfo,
} from '@expense-tracker-ui/api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KeycloakPlaygroundService {
  private api: KeycloakIntegrationControllerService = inject(KeycloakIntegrationControllerService); // TODO better way to reference the generated code?

  getAdmin(): Observable<UserInfo> {
    return this.api.admin();
  }
}
