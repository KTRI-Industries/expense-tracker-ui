import { Component } from '@angular/core';
import { UserPageComponent } from './user-page.component';
import { AsyncPipe } from '@angular/common';
import {
  MatTab,
  MatTabGroup,
  MatTabLink,
  MatTabNav,
  MatTabNavPanel,
} from '@angular/material/tabs';
import { TenantListComponent } from './tenant-list.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-user-page-container',
  standalone: true,
  imports: [
    UserPageComponent,
    AsyncPipe,
    MatTabGroup,
    MatTab,
    TenantListComponent,
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
        [active]="rla2.isActive">
        Accounts
      </a>
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class UserPageContainerComponent {}
