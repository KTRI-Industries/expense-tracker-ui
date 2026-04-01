import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import {
  AmountInputComponent,
  ChipsComponent,
  FileUploadComponent,
} from '@expense-tracker-ui/shared/formly';

export function createAppFormlyTestingImports() {
  return [
    FormlyMaterialModule,
    FormlyMatDatepickerModule,
    FormlyModule.forRoot({
      types: [
        {
          name: 'chips',
          component: ChipsComponent,
          defaultOptions: {
            defaultValue: [],
          },
          wrappers: ['form-field'],
        },
        {
          name: 'amount-input',
          component: AmountInputComponent,
          wrappers: ['form-field'],
        },
        {
          name: 'file',
          component: FileUploadComponent,
          wrappers: ['form-field'],
        },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
      ],
    }),
  ];
}

export function createAppFormlyTestingProviders() {
  return [
    provideMomentDateAdapter(
      {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
      { useUtc: true },
    ),
    provideEnvironmentNgxMask({
      decimalMarker: ',',
      thousandSeparator: '.',
    }),
  ];
}
