import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  Category,
  CreateRecurrentTransactionCommand,
  RecurrenceFrequency,
} from '@expense-tracker-ui/shared/api';
import {
  createAppFormlyTestingImports,
  createAppFormlyTestingProviders,
} from '@expense-tracker-ui/testing/formly';
import { RecurrentTransactionComponent } from './recurrent-transaction.component';

describe('RecurrentTransactionComponent', () => {
  let component: RecurrentTransactionComponent;
  let fixture: ComponentFixture<RecurrentTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecurrentTransactionComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ...createAppFormlyTestingImports(),
      ],
      providers: [...createAppFormlyTestingProviders()],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrentTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create RecurrentTransactionComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should emit create event with the selected transaction currency', () => {
    component.selectedTransaction = {
      amount: { amount: undefined, currency: 'USD' },
      recurrencePeriod: {
        startDate: '2022-01-01',
        frequency: RecurrenceFrequency.Monthly,
      },
      description: '',
      categories: [],
      recurrentTransactionId: '',
      tenantId: 'tenant-1',
      userId: 'user-1',
    };
    component.ngOnInit();

    const command: CreateRecurrentTransactionCommand = {
      amount: { amount: 100, currency: 'EUR' },
      description: 'Test',
      categories: [Category.Bill],
      recurrencePeriod: {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        frequency: RecurrenceFrequency.Monthly,
      },
    };

    component.model = {
      amount: { amount: command.amount.amount, currency: 'USD' },
      description: command.description,
      categories: ['bills'],
      recurrencePeriod: command.recurrencePeriod,
      recurrentTxId: undefined,
      txType: 'EXPENSE',
    };
    component.transactionForm = new FormGroup({});

    jest.spyOn(component.create, 'emit');

    component.onCreate();

    expect(component.create.emit).toHaveBeenCalledWith({
      ...command,
      amount: { amount: command.amount.amount ?? 0, currency: 'USD' },
      categories: ['bills'],
      recurrentTxId: undefined,
      txType: 'EXPENSE',
    });
  });
});
