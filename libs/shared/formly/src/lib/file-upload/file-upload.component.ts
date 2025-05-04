import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FileValueAccessorDirective } from './file-value-accessor.directive';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'expense-tracker-ui-file-upload',
  template: `
    <input
      type="file"
      [formControl]="formControl"
      [formlyAttributes]="field"
      (change)="onFileChange($event)" />
  `,
  // FileValueAccessorDirective is required to make the file input work with Formly
  imports: [ReactiveFormsModule, FileValueAccessorDirective, FormlyModule],
})
export class FileUploadComponent extends FieldType<FieldTypeConfig> {
  /**
   * Extracts the first File from the input's FileList and sets it on the FormControl.
   * Angular's reactive forms don’t natively bind file inputs, so we must manually
   * update the control value to propagate the selected file to the Formly model.
   */
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.formControl.setValue(file);
  }
}
