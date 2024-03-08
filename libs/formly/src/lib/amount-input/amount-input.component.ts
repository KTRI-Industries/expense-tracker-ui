import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FieldType } from '@ngx-formly/material'; // THIS IS REQUIRED!! DO NOT IMPORT FROM @ngx-formly/core

@Component({
  selector: 'expense-tracker-ui-amount-input',
  standalone: true,
  imports: [
    CommonModule,
    MatInput,
    ReactiveFormsModule,
    FormlyModule,
    NgxCurrencyDirective,
  ],
  template: `
    <input
      matInput
      currencyMask
      [placeholder]="field.props.placeholder!!"
      [formControl]="formControl"
      [formlyAttributes]="field"
      data-lpignore="true" />
    <!-- data-lpignore needed to hide last pass fields -->
  `,
  styles: `
      /* Different text align for input value and placeholder*/
      input::placeholder {
          text-align: left;
      }
  `,
})
export class AmountInputComponent extends FieldType<FieldTypeConfig> {}
