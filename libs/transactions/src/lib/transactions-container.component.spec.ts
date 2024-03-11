import { TransactionsContainerComponent } from './transactions-container.component';
import { render, RenderResult, screen } from '@testing-library/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { TransactionsSelectors } from '../index';
import '@testing-library/jest-dom';
import { PageTransactionDto } from '@expense-tracker-ui/api';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LOCALE_ID } from '@angular/core';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import '@angular/common/locales/global/el'; // LOCALE_ID is not enough

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
    console.log(screen.debug());

    const noTransactionsText = screen.queryByText('No transactions found.');

    expect(noTransactionsText).toBeInTheDocument();
  });
});

async function setup(transactions: PageTransactionDto) {
  return await render(TransactionsContainerComponent, {
    providers: [
      provideMockStore({
        selectors: [
          {
            selector: TransactionsSelectors.selectTransactions,
            value: transactions,
          },
        ],
      }),

      { provide: MAT_DATE_LOCALE, useValue: 'el-GR' },
      { provide: LOCALE_ID, useValue: 'el-GR' },
      {
        provide: DATE_PIPE_DEFAULT_OPTIONS,
        useValue: { dateFormat: 'shortDate' },
      }
    ],
  });
}
