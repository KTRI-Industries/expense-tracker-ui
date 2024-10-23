import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TransactionsComponent } from './transactions.component';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'expense-tracker-ui-transactions-container',
  standalone: true,
  imports: [
    TransactionsComponent,
    AsyncPipe,
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
  ],
  template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel">
      <a
        mat-tab-link
        routerLinkActive
        #rla1="routerLinkActive"
        [routerLink]="['/transactions-page/transactions']"
        [active]="rla1.isActive">
        Transactions
      </a>
      <a
        mat-tab-link
        routerLinkActive
        #rla2="routerLinkActive"
        [routerLink]="['/transactions-page/recurrent-transactions']"
        [active]="rla2.isActive"
        data-cy="recurrent-transactions-tab">
        Recurrent Transactions
      </a>
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class TransactionsPageContainerComponent {}
