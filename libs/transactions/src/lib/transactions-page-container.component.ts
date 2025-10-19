import { Component } from '@angular/core';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { FeatureFlagSelectors } from '@expense-tracker-ui/shared/feature-flags';

@Component({
  selector: 'expense-tracker-ui-transactions-container',
  imports: [
    MatTabLink,
    MatTabNav,
    MatTabNavPanel,
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    AsyncPipe,
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
      @if (importTransactionsEnabled$ | async) {
        <a
          mat-tab-link
          routerLinkActive
          #rla3="routerLinkActive"
          [routerLink]="['/transactions-page/import-transactions']"
          [active]="rla3.isActive">
          Import Transactions
        </a>
      }
    </nav>
    <mat-tab-nav-panel #tabPanel></mat-tab-nav-panel>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class TransactionsPageContainerComponent {
  importTransactionsEnabled$ = this.store.select(
    FeatureFlagSelectors.selectImportTransactionsEnabled,
  );

  constructor(private store: Store) {}
}
