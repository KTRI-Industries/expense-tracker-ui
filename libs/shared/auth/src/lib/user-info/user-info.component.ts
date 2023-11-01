import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'expense-tracker-ui-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
  styles: [],
})
export class UserInfoComponent {
  @Input() isLoggedIn: boolean | null = false;
  @Input() userProfile: KeycloakProfile | null = null;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
