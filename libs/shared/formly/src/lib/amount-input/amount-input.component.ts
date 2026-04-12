import { getCurrencySymbol } from '@angular/common';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { FieldType } from '@ngx-formly/material'; // THIS IS REQUIRED!! DO NOT IMPORT FROM @ngx-formly/core
import { FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { NgxMaskDirective } from 'ngx-mask';

type AmountInputProps = FieldTypeConfig['props'] & {
  currencyCode?: string;
  placeholder?: string;
};

@Component({
  selector: 'expense-tracker-ui-amount-input',
  imports: [MatInput, ReactiveFormsModule, FormlyModule, NgxMaskDirective],
  template: `
    <input
      matInput
      mask="separator.2"
      [prefix]="prefix()"
      type="text"
      [allowNegativeNumbers]="false"
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
  private locale = inject(LOCALE_ID);
  private readonly fallbackCurrencyCode = 'EUR';

  prefix() {
    return `${this.resolveCurrencySymbol()} `;
  }

  private resolveCurrencyCode(): string {
    return (
      (this.field.props as AmountInputProps).currencyCode ??
      this.fallbackCurrencyCode
    );
  }

  private resolveCurrencySymbol(): string {
    const currencyCode = this.resolveCurrencyCode();

    try {
      return getCurrencySymbol(currencyCode, 'narrow', this.locale);
    } catch {
      return currencyCode;
    }
  }
}
