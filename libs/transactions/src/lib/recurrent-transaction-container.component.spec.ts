import { render, RenderResult } from '@testing-library/angular';
import { RecurrentTransactionContainerComponent } from './recurrent-transaction-container.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';

import { selectCurrentRecurrentTransaction } from './+state/recurrent-transactions.selectors';
import { TestBed } from '@angular/core/testing';
import { FormlyModule } from '@ngx-formly/core';

import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  AmountInputComponent,
  ChipsComponent,
} from '@expense-tracker-ui/shared/formly';
import { RecurrenceFrequency } from '@expense-tracker-ui/shared/api';
import { RecurrentTransactionActions } from './+state/transactions.actions';

describe('RecurrentTransactionContainerComponent', () => {
  let component: RenderResult<RecurrentTransactionContainerComponent>;

  const setup = async (routeValue: string | null) => {
    component = await render(RecurrentTransactionContainerComponent, {
      imports: [
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
              wrappers: ['form-field'], // wraps custom field with material form field to show validation errors
            },
            {
              name: 'amount-input',
              component: AmountInputComponent,
              wrappers: ['form-field'], // wraps custom field with material form field to show validation errors
            },
          ],
          validationMessages: [
            { name: 'required', message: 'This field is required' },
          ],
        }),
      ],
      providers: [
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
        provideMockStore({
          selectors: [
            {
              selector: selectCurrentRecurrentTransaction,
              value: {
                recurrentTransactionId: '123',
                amount: { amount: 100, currency: 'USD' },
                description: 'Test',
                categories: ['bills'],
                recurrencePeriod: {
                  startDate: '2022-01-01',
                  endDate: '2022-12-31',
                  frequency: 'MONTHLY',
                },
              },
            },
          ],
        }),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => routeValue,
              },
            },
          },
        },
      ],
    });
    const store = TestBed.inject(MockStore);
    store.dispatch = jest.fn();
    return { dispatchSpy: store.dispatch };
  };

  // TODO: during ngOnInit dispatch method of store has not been mocked yet
  it.skip('should load recurrent transaction if id is present in route', async () => {
    const { dispatchSpy } = await setup('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      RecurrentTransactionActions.loadRecurrentTransaction({
        recurrentTransactionId: '123',
      }),
    );
  });

  it('should not load recurrent transaction if id is not present in route', async () => {
    const { dispatchSpy } = await setup(null);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch createNewRecurrentTransaction action on create', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onCreate({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      description: 'Test',
      recurrencePeriod: {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        frequency: RecurrenceFrequency.Monthly,
      },
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch updateRecurrentTransaction action on update', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onUpdate({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      description: 'Test',
      recurrencePeriod: {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        frequency: RecurrenceFrequency.Monthly,
      },
      recurrentTxId: '123',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch deleteRecurrentTransaction action on delete', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onDelete('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      RecurrentTransactionActions.deleteRecurrentTransaction({
        recurrentTransactionId: '123',
      }),
    );
  });
});
