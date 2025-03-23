import { Component } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
  ],
  template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel">
      <a
        mat-tab-link
        routerLinkActive
        #rla1="routerLinkActive"
        [routerLink]="['/user-page/users']"
        [active]="rla1.isActive">
        Users
      </a>
      <a
        mat-tab-link
        routerLinkActive
        #rla2="routerLinkActive"
        [routerLink]="['/user-page/tenants']"
        [active]="rla2.isActive"
        data-cy="tenants-tab">
        Accounts
      </a>
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class UserPageContainerComponent {}
