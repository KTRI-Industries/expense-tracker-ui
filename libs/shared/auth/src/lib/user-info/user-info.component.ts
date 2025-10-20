import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TenantAwareKeycloakProfile } from '../+state/auth.reducer';

@Component({
  selector: 'expense-tracker-ui-user-info',
  imports: [],
  templateUrl: './user-info.component.html',
  styles: [],
})
export class UserInfoComponent {
  @Input() isLoggedIn: boolean | null = false;
  @Input() userProfile: TenantAwareKeycloakProfile | null = null;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
