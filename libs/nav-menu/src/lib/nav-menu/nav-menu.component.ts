import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'expense-tracker-ui-nav-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatSidenavContainer,
    MatNavList,
    MatSidenav,
    MatSidenavContent,
    RouterLink,
    MatButton,
    MatChip,
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {
  @Input() username: string | null | undefined = '';
  @Input() isAuthenticated: boolean | null | undefined = false;
  @Input() isTenantOwner: boolean | null | undefined = false;
  @Input() tenantId: string | null | undefined;
  @Input() currentTenant: string | null | undefined;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onLogin() {
    this.login.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
