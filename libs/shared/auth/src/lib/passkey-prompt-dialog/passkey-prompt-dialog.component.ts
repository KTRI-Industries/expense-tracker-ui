import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type PasskeyPromptResult = 'setup' | 'later' | 'never';

@Component({
  selector: 'expense-tracker-ui-passkey-prompt-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './passkey-prompt-dialog.component.html',
  styles: `
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,
})
export class PasskeyPromptDialogComponent {
  private dialogRef =
    inject<MatDialogRef<PasskeyPromptDialogComponent, PasskeyPromptResult>>(
      MatDialogRef,
    );

  onSetup(): void {
    this.dialogRef.close('setup');
  }

  onNotNow(): void {
    this.dialogRef.close('later');
  }

  onDontAskAgain(): void {
    this.dialogRef.close('never');
  }
}
