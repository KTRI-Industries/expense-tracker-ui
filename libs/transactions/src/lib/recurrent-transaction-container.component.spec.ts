import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Category, RecurrenceFrequency } from '@expense-tracker-ui/shared/api';
import {
  createAppFormlyTestingImports,
  createAppFormlyTestingProviders,
} from '@expense-tracker-ui/testing/formly';
import { RecurrentTransactionContainerComponent } from './recurrent-transaction-container.component';
import { RecurrentTransactionComponent } from './recurrent-transaction.component';
import { RecurrentTransactionActions } from './+state/transactions.actions';
import { selectCurrentRecurrentTransaction } from './+state/recurrent-transactions.selectors';

describe('RecurrentTransactionContainerComponent', () => {
  const selectedTransaction = {
    recurrentTransactionId: '123',
    amount: { amount: -100, currency: 'USD' },
    description: 'Test recurrent transaction',
    categories: [Category.Bill],
    recurrencePeriod: {
      startDate: '2022-01-01',
      endDate: '2022-12-31',
      frequency: 'MONTHLY',
    },
  };

  async function setup(routeValue: string | null) {
    const store = {
      dispatch: jest.fn(),
      select: jest.fn((selector: unknown) => {
        if (selector === selectCurrentRecurrentTransaction) {
          return of(selectedTransaction);
        }

        return of(undefined);
      }),
    };

    const renderResult = await render(RecurrentTransactionContainerComponent, {
      imports: [...createAppFormlyTestingImports()],
      providers: [
        ...createAppFormlyTestingProviders(),
        {
          provide: Store,
          useValue: store,
        },
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

    const childComponent =
      renderResult.fixture.debugElement.query(
        By.directive(RecurrentTransactionComponent),
      ).componentInstance as RecurrentTransactionComponent;

    return { childComponent, store };
  }

  it('dispatches loadRecurrentTransaction during initial render when the route contains an id', async () => {
    const { store } = await setup('123');

    expect(store.dispatch).toHaveBeenCalledWith(
      RecurrentTransactionActions.loadRecurrentTransaction({
        recurrentTransactionId: '123',
      }),
    );
  });

  it('does not dispatch loadRecurrentTransaction when the route has no id', async () => {
    const { store } = await setup(null);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches the mapped create action when the child emits create', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.create.emit({
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

    const dispatchedAction = store.dispatch.mock.calls[
      store.dispatch.mock.calls.length - 1
    ]?.[0] as {
      type: string;
      recurrentTransactionCommand: Record<string, unknown>;
    };

    expect(dispatchedAction.type).toBe(
      RecurrentTransactionActions.createNewRecurrentTransaction.type,
    );
    expect(dispatchedAction.recurrentTransactionCommand).toMatchObject({
      txType: 'EXPENSE',
      amount: { amount: -100, currency: 'USD' },
      categories: [Category.Bill],
      description: 'Test',
      recurrencePeriod: {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        frequency: RecurrenceFrequency.Monthly,
      },
    });
  });

  it('dispatches the mapped update action when the child emits update', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.update.emit({
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

    const dispatchedAction = store.dispatch.mock.calls[
      store.dispatch.mock.calls.length - 1
    ]?.[0] as {
      type: string;
      updateRecurrentTransactionCommand: Record<string, unknown>;
    };

    expect(dispatchedAction.type).toBe(
      RecurrentTransactionActions.updateRecurrentTransaction.type,
    );
    expect(dispatchedAction.updateRecurrentTransactionCommand).toMatchObject({
      txType: 'EXPENSE',
      amount: { amount: -100, currency: 'USD' },
      categories: [Category.Bill],
      description: 'Test',
      recurrencePeriod: {
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        frequency: RecurrenceFrequency.Monthly,
      },
      recurrentTransactionId: '123',
      recurrentTxId: '123',
    });
  });

  it('dispatches deleteRecurrentTransaction when the child emits delete', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.delete.emit('123');

    expect(store.dispatch).toHaveBeenCalledWith(
      RecurrentTransactionActions.deleteRecurrentTransaction({
        recurrentTransactionId: '123',
      }),
    );
  });
});
