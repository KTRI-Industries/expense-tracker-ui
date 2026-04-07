import { Component } from '@angular/core';
import { FieldType } from '@ngx-formly/material';
import { ReactiveFormsModule } from '@angular/forms';
import { FileValueAccessorDirective } from './file-value-accessor.directive';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'expense-tracker-ui-file-upload',
  template: `
    <!-- file-upload-zone: dashed border drop zone that responds to hover with
         amber accent — hides the native input and shows upload icon + prompt
         (see material.css for .file-upload-zone styles) -->
    <label class="file-upload-zone">
      <mat-icon>cloud_upload</mat-icon>
      @if (formControl.value?.name) {
        <!-- Show selected filename in brand green -->
        <span class="file-name">{{ formControl.value.name }}</span>
      } @else {
        <span>Choose a CSV file or drag it here</span>
      }
      <input
        type="file"
        class="hidden"
        [formControl]="formControl"
        [formlyAttributes]="field"
        (change)="onFileChange($event)" />
    </label>
  `,
  // FileValueAccessorDirective is required to make the file input work with Formly
  imports: [ReactiveFormsModule, FileValueAccessorDirective, FormlyModule, MatIconModule],
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
