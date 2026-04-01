import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { render } from '@testing-library/angular';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Category } from '@expense-tracker-ui/shared/api';
import {
  createAppFormlyTestingImports,
  createAppFormlyTestingProviders,
} from '@expense-tracker-ui/testing/formly';
import { TransactionContainerComponent } from './transaction-container.component';
import { TransactionComponent } from './transaction.component';
import { TransactionActions } from './+state/transactions.actions';
import { selectCurrentTransaction } from './+state/transactions.selectors';

describe('TransactionContainerComponent', () => {
  const selectedTransaction = {
    transactionId: '123',
    amount: { amount: -100, currency: 'USD' },
    date: '2022-01-01',
    description: 'Test transaction',
    categories: [Category.Bill],
    tenantId: 'tenant-1',
  };

  async function setup(routeValue: string | null) {
    const store = {
      dispatch: jest.fn(),
      select: jest.fn((selector: unknown) => {
        if (selector === selectCurrentTransaction) {
          return of(selectedTransaction);
        }

        return of(undefined);
      }),
    };

    const renderResult = await render(TransactionContainerComponent, {
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
      renderResult.fixture.debugElement.query(By.directive(TransactionComponent))
        .componentInstance as TransactionComponent;

    return { childComponent, store };
  }

  it('dispatches loadTransaction during initial render when the route contains an id', async () => {
    const { store } = await setup('123');

    expect(store.dispatch).toHaveBeenCalledWith(
      TransactionActions.loadTransaction({ transactionId: '123' }),
    );
  });

  it('does not dispatch loadTransaction when the route has no id', async () => {
    const { store } = await setup(null);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('dispatches the mapped create action when the child emits create', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.create.emit({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      date: '2022-01-01',
    });

    const dispatchedAction = store.dispatch.mock.calls[
      store.dispatch.mock.calls.length - 1
    ]?.[0] as {
      type: string;
      transaction: Record<string, unknown>;
    };

    expect(dispatchedAction.type).toBe(
      TransactionActions.createNewTransaction.type,
    );
    expect(dispatchedAction.transaction).toMatchObject({
      txType: 'EXPENSE',
      amount: { amount: -100, currency: 'USD' },
      categories: [Category.Bill],
      date: '2022-01-01',
    });
  });

  it('dispatches the mapped update action when the child emits update', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.update.emit({
      txType: 'EXPENSE',
      amount: { amount: 100, currency: 'USD' },
      categories: ['bills'],
      date: '2022-01-01',
      txId: '123',
    });

    const dispatchedAction = store.dispatch.mock.calls[
      store.dispatch.mock.calls.length - 1
    ]?.[0] as {
      type: string;
      transaction: Record<string, unknown>;
    };

    expect(dispatchedAction.type).toBe(TransactionActions.updateTransaction.type);
    expect(dispatchedAction.transaction).toMatchObject({
      txType: 'EXPENSE',
      amount: { amount: -100, currency: 'USD' },
      categories: [Category.Bill],
      date: '2022-01-01',
      transactionId: '123',
      txId: '123',
    });
  });

  it('dispatches deleteTransaction when the child emits delete', async () => {
    const { childComponent, store } = await setup(null);

    childComponent.delete.emit('123');

    expect(store.dispatch).toHaveBeenCalledWith(
      TransactionActions.deleteTransaction({ transactionId: '123' }),
    );
  });
});
