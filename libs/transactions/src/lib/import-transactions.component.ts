import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  FormlyFieldConfig,
  FormlyFormOptions,
  FormlyModule,
} from '@ngx-formly/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatButton } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'expense-tracker-ui-import-transactions',
  templateUrl: './import-transactions.component.html',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    FormlyModule,
    MatButton,
  ],
})
export class ImportTransactionsComponent {
  @Output() import = new EventEmitter<File>();

  form = this.fb.group({});
  model: { file?: File } = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [
    {
      key: 'file',
      type: 'file',
      props: {
        required: true,
        attributes: {
          accept: '.csv',
          'data-cy': 'import-file-input',
        },
      },
    },
  ];

  constructor(private fb: FormBuilder) {}

  onImport(): void {
    if (this.form.valid && this.model.file) {
      this.import.emit(this.model.file);
    }
  }
}
