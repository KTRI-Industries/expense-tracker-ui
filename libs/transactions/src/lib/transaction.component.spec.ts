import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionComponent } from './transaction.component';
import { Category, CreateTransactionCommand } from '@expense-tracker-ui/api';
import { FormlyModule } from '@ngx-formly/core';
import {
  AmountInputComponent,
  ChipsComponent,
} from '@expense-tracker-ui/formly';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { provideMockStore } from '@ngrx/store/testing';
import { categoryLabels } from './transaction.model';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionComponent,
        ReactiveFormsModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        NoopAnimationsModule,

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
      declarations: [],
      providers: [
        provideMockStore(),
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
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TransactionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.transactionForm).toBeDefined();
    expect(component.fields).toBeDefined();
  });

  it('should emit create event when onCreate is called with valid form', () => {
    const command: CreateTransactionCommand = {
      amount: { amount: 100, currency: 'EUR' },
      date: '2022-01-01',
      description: 'Test',
      categories: [Category.Bill],
    };

    component.transactionForm.setValue({
      txType: 'EXPENSE',
      amount: { amount: command.amount.amount },
      date: command.date,
      description: command.description,
      categories: command.categories?.map(
        (category) => categoryLabels[category],
      ),
    });

    // Spy on event emitter
    jest.spyOn(component.create, 'emit');

    component.onCreate();

    // Assert that event was emitted with correct value
    expect(component.create.emit).toHaveBeenCalledWith({
      ...command,
      amount: { amount: (command.amount.amount ?? 0), currency: undefined }, // currency is taken from the model which is not set here
      date: '2022-01-01',
      categories: ['bills',],
      txId: undefined,
      txType: 'EXPENSE',
    });
  });

  it('should not emit create event when onCreate is called with invalid form', () => {
    const command: CreateTransactionCommand = {
      amount: { amount: undefined, currency: 'EUR' },
      date: '2022-01-01',
      description: 'Test',
    };

    component.transactionForm.patchValue({
      amount: { amount: command.amount.amount },
      date: command.date,
      description: command.description,
    });

    // Spy on event emitter
    jest.spyOn(component.create, 'emit');

    component.onCreate();

    // Assert that event was not emitted
    expect(component.create.emit).not.toHaveBeenCalled();
  });
});
