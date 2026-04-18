import { Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {
  COMMON_CURRENCIES,
  DEFAULT_CURRENCY,
} from '@expense-tracker-ui/constants';

@Component({
  selector: 'expense-tracker-ui-onboarding-currency-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './onboarding-currency-dialog.component.html',
  styles: `
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .currency-field {
      width: 100%;
    }
  `,
})
export class OnboardingCurrencyDialogComponent {
  private dialogRef =
    inject<MatDialogRef<OnboardingCurrencyDialogComponent, string>>(
      MatDialogRef,
    );

  readonly currencies = COMMON_CURRENCIES;
  selectedCurrency = signal<string>(DEFAULT_CURRENCY);

  constructor() {
    this.dialogRef.disableClose = true;
  }

  onContinue(): void {
    this.dialogRef.close(this.selectedCurrency());
  }
}
