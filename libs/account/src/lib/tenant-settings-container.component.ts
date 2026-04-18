import { Component, inject, signal, computed, effect } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { toSignal } from '@angular/core/rxjs-interop';
import { AccountActions } from './+state/account.actions';
import {
  selectCurrentAccountCurrency,
  selectCurrentAccount,
  selectIsUserCurrentAccountOwner,
} from './+state/account.selectors';
import {
  COMMON_CURRENCIES,
  DEFAULT_CURRENCY,
} from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-tenant-settings-container',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="settings-card">
      <mat-card-header>
        <mat-card-title>Account Settings</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <p class="info">
          <mat-icon inline="true">info</mat-icon>
          Currency can only be changed while this account has no transactions.
          @if (!isOwner()) {
            Only the account owner can change the currency.
          }
        </p>

        <mat-form-field class="currency-field" appearance="outline">
          <mat-label>Currency</mat-label>
          <mat-select
            [ngModel]="selected()"
            (ngModelChange)="selected.set($event)"
            [disabled]="!isOwner() || !tenantId()"
            data-cy="tenant-settings-currency-select">
            @for (c of currencies; track c.code) {
              <mat-option [value]="c.code">
                {{ c.code }} — {{ c.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions align="end">
        <button
          mat-raised-button
          color="primary"
          [disabled]="!canSave()"
          (click)="onSave()"
          data-cy="tenant-settings-save">
          Save
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    .settings-card {
      max-width: 600px;
      margin: 24px auto;
    }
    .currency-field {
      width: 100%;
      margin-top: 16px;
    }
    .info {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--mat-sys-on-surface-variant);
    }
  `,
})
export class TenantSettingsContainerComponent {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private snackBar = inject(MatSnackBar);

  readonly currencies = COMMON_CURRENCIES;

  readonly tenantId = toSignal(this.store.select(selectCurrentAccount), {
    initialValue: '',
  });
  readonly currentCurrency = toSignal(
    this.store.select(selectCurrentAccountCurrency),
    { initialValue: DEFAULT_CURRENCY },
  );
  readonly isOwner = toSignal(
    this.store.select(selectIsUserCurrentAccountOwner),
    { initialValue: false },
  );

  selected = signal<string>(DEFAULT_CURRENCY);

  readonly canSave = computed(
    () =>
      this.isOwner() &&
      !!this.tenantId() &&
      this.selected() !== this.currentCurrency(),
  );

  constructor() {
    effect(() => {
      this.selected.set(this.currentCurrency());
    });

    this.actions$
      .pipe(ofType(AccountActions.updateAccountCurrencySuccess))
      .subscribe(() => {
        this.snackBar.open('Currency updated', 'Dismiss', { duration: 3000 });
      });

    this.actions$
      .pipe(ofType(AccountActions.updateAccountCurrencyFailure))
      .subscribe(({ error }) => {
        const message =
          (error as unknown as { error?: { title?: string; detail?: string } })
            ?.error?.detail ??
          (error as unknown as { error?: { title?: string } })?.error?.title ??
          error?.message ??
          'Failed to update currency';
        this.snackBar.open(message, 'Dismiss', { duration: 5000 });
      });
  }

  onSave(): void {
    const id = this.tenantId();
    if (!id) return;
    this.store.dispatch(
      AccountActions.updateAccountCurrency({
        tenantId: id,
        currency: this.selected(),
      }),
    );
  }
}
