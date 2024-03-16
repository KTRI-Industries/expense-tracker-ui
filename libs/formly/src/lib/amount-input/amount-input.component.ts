import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FieldType } from '@ngx-formly/material'; // THIS IS REQUIRED!! DO NOT IMPORT FROM @ngx-formly/core
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'expense-tracker-ui-amount-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInput,
    ReactiveFormsModule,
    FormlyModule,
    NgxMaskDirective,
  ],
  template: `
    <input
      matInput
      mask="separator.2"
      [prefix]="prefix()"
      [allowNegativeNumbers]="true"
      [placeholder]="field.props.placeholder!!"
      [formControl]="formControl"
      [formlyAttributes]="field" />
  `,
  styles: `
      /* Different text align for input value and placeholder*/
      input {
            text-align: right;
      }
      input::placeholder {
          text-align: left;
      }
  `,
})
export class AmountInputComponent extends FieldType<FieldTypeConfig> {
  @Input() currencySymbol = '€';

  prefix() {
    return this.currencySymbol + ' ';
  }
}
