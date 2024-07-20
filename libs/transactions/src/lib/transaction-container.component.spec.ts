import { render, RenderResult } from '@testing-library/angular';
import { TransactionContainerComponent } from './transaction-container.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ActivatedRoute } from '@angular/router';
import { TransactionActions } from './+state/transactions.actions';
import { selectCurrentTransaction } from './+state/transactions.selectors';
import { TestBed } from '@angular/core/testing';
import { FormlyModule } from '@ngx-formly/core';
import {
  AmountInputComponent,
  ChipsComponent,
} from '@expense-tracker-ui/formly';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';

describe('TransactionContainerComponent', () => {
  let component: RenderResult<TransactionContainerComponent>;

  const setup = async (routeValue: string | null) => {
    component = await render(TransactionContainerComponent, {
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
              selector: selectCurrentTransaction,
              value: {
                transactionId: '123',
                amount: { amount: 100, currency: 'USD' },
                date: '2022-01-01',
                description: 'Test',
                tenantId: 'test',
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
  it.skip('should load transaction if id is present in route', async () => {
    const { dispatchSpy } = await setup('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.loadTransaction({ transactionId: '123' }),
    );
  });

  it('should not load transaction if id is not present in route', async () => {
    const { dispatchSpy } = await setup(null);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch createNewTransaction action on create', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onCreate({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      date: '2022-01-01',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch updateTransaction action on update', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onUpdate({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      date: '2022-01-01',
      txId: '123',
    });
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch deleteTransaction action on delete', async () => {
    const { dispatchSpy } = await setup('123');
    component.fixture.componentInstance.onDelete('123');
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.deleteTransaction({ transactionId: '123' }),
    );
  });
});
