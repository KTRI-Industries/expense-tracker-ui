import { Directive } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * FileValueAccessorDirective is required because Angular's Reactive Forms
 * do not support native file inputs out-of-the-box. By implementing
 * ControlValueAccessor, this directive listens for file selection changes
 * and propagates the FileList into the form control value.
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'input[type=file]',
  host: {
    '(change)': 'onChange($event.target.files)',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileValueAccessorDirective,
      multi: true,
    },
  ],
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  writeValue(_value: any) {}
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }
}
