import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { MatNavList } from '@angular/material/list';

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
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {
  @Input() username: string | null | undefined = '';
  @Input() isAuthenticated: boolean | null | undefined = false;

  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onLogin() {
    this.login.emit();
  }

  onLogout() {
    this.logout.emit();
  }
}
