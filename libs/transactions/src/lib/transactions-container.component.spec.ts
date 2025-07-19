import { TransactionsContainerComponent } from './transactions-container.component';
import {
  fireEvent,
  render,
  RenderResult,
  screen,
} from '@testing-library/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TransactionActions, TransactionsSelectors } from '../index';
import '@testing-library/jest-dom';
import { PageTransactionDto } from '@expense-tracker-ui/shared/api';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import '@angular/common/locales/global/el';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';

describe('TransactionsContainerComponent', () => {
  let renderResult: RenderResult<TransactionsContainerComponent>;

  it('should create TransactionsContainerComponent', async () => {
    renderResult = await setup({} as PageTransactionDto);

    expect(renderResult.fixture.componentInstance).toBeTruthy();
  });

  it('should display transactions when transactions are available', async () => {
    const pageTransactionDto: PageTransactionDto = {
      content: [
        {
          transactionId: '1',
          amount: { amount: 100, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '2',
          amount: { amount: 200, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
      ],
      totalElements: 2,
    };

    renderResult = await setup(pageTransactionDto);

    pageTransactionDto.content?.forEach((transaction) => {
      expect(
        screen.getByText(`${transaction.amount.amount},00 €`),
      ).toBeInTheDocument();
    });
  });

  it('should not display transactions when no transactions are available', async () => {
    const pageTransactionDto: PageTransactionDto = {
      content: [],
      totalElements: 0,
    };

    renderResult = await setup(pageTransactionDto);

    const noTransactionsText = screen.queryByText('No transactions found.');

    expect(noTransactionsText).toBeInTheDocument();
  });

  it('should dispatch openTransactionFrom action when onOpenTransactionForm is called', async () => {
    renderResult = await setup({} as PageTransactionDto);
    const store = renderResult.fixture.debugElement.injector.get(MockStore);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    const button = screen.getByRole('button', { name: /Add new transaction/i });
    fireEvent.click(button);

    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.openTransactionFrom(),
    );
  });

  it('should dispatch initTransactions action when pager buttons are clicked', async () => {
    const pageTransactionDto: PageTransactionDto = {
      content: [
        {
          transactionId: '1',
          amount: { amount: 100, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '2',
          amount: { amount: 200, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '3',
          amount: { amount: 300, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '4',
          amount: { amount: 400, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '5',
          amount: { amount: 500, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '6',
          amount: { amount: 600, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
      ],
      totalElements: 10,
    };
    renderResult = await setup(pageTransactionDto);
    const store = renderResult.fixture.debugElement.injector.get(MockStore);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Simulate click on the next page button
    const nextPageButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextPageButton);

    // Assert that initTransactions action is dispatched with correct pageable value
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.initTransactions({
        pageable: { page: 1, sort: ['date,desc'], size: 5 },
        filterRange: undefined,
      }),
    );

    // Reset the spy
    dispatchSpy.mockReset();

    // Simulate click on the previous page button
    const previousPageButton = screen.getByRole('button', {
      name: /previous page/i,
    });
    fireEvent.click(previousPageButton);

    // Assert that initTransactions action is dispatched with correct pageable value
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.initTransactions({
        pageable: { page: 0, sort: ['date,desc'], size: 5 },
        filterRange: undefined,
      }),
    );
  });

  it('should dispatch initTransactions action when date column is clicked for sorting', async () => {
    const pageTransactionDto: PageTransactionDto = {
      content: [
        {
          transactionId: '1',
          amount: { amount: 100, currency: 'EUR' },
          date: '2022-01-02',
          description: 'Test',
          tenantId: 'test',
        },
        {
          transactionId: '2',
          amount: { amount: 200, currency: 'EUR' },
          date: '2022-01-01',
          description: 'Test',
          tenantId: 'test',
        },
      ],
      totalElements: 2,
    };
    renderResult = await setup(pageTransactionDto);
    const store = renderResult.fixture.debugElement.injector.get(MockStore);
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    // Simulate click event on the 'date' column header
    const dateColumnHeader = screen.getByRole('columnheader', {
      name: /date/i,
    });
    fireEvent.click(dateColumnHeader);

    // Assert that initTransactions action is dispatched with correct pageable value
    expect(dispatchSpy).toHaveBeenCalledWith(
      TransactionActions.initTransactions({
        pageable: { page: 0, sort: ['date,asc'], size: 5 },
        filterRange: undefined,
      }),
    );
  });
});

async function setup(transactions: PageTransactionDto) {
  return await render(TransactionsContainerComponent, {
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: TransactionsSelectors.selectAugmentedTransactions,
            value: transactions,
          },
        ],
      }),

      { provide: MAT_DATE_LOCALE, useValue: 'el-GR' },
      { provide: LOCALE_ID, useValue: 'el-GR' },
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { dateFormat: 'shortDate' },
      },
    ],
    imports: [FormlyModule.forRoot(), FormlyMaterialModule],
  });
}
