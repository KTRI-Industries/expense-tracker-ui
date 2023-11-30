import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantAwareKeycloakProfile } from '../+state/auth.reducer';


@Component({
  selector: 'expense-tracker-ui-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styles: [],
})
export class UserInfoComponent {
  @Input() isLoggedIn: boolean | null = false;
  @Input() userProfile: TenantAwareKeycloakProfile | null = null;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
