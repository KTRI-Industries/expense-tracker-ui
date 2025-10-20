import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { DashboardEffects } from './dashboard.effects';
import { DashboardDto, MonetaryAmount } from '@expense-tracker-ui/shared/api';
import { DashboardActions } from './dashboard.actions';
import { cold, hot } from 'jasmine-marbles';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import moment from 'moment';
import { DashboardService } from '../dashboard.service';

describe('DashboardEffects', () => {
  let actions$: Observable<Action>;
  let service: DashboardService;

  const createMonetaryAmount = (
    amount: number,
    currency = 'EUR',
  ): MonetaryAmount => ({
    amount,
    currency,
  });

  const createMockDashboard = (): DashboardDto => ({
    mainTransactionData: {
      totalExpense: createMonetaryAmount(1000),
      totalIncome: createMonetaryAmount(2000),
      totalBalance: createMonetaryAmount(1000),
      totalTransactions: 10,
    },
    expenseByCategory: {
      labels: [],
      values: [],
    },
    incomeExpensePerMonth: {
      labels: [],
      values: [],
    },
    incomeExpensePerMonthPerIndividual: null,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: DashboardService,
          useValue: {
            getDashboard: jest.fn(),
          },
        },
      ],
    });

    service = TestBed.inject(DashboardService);
  });

  it('should load dashboard successfully', () => {
    const mockDashboard = createMockDashboard();

    jest.spyOn(service, 'getDashboard').mockReturnValue(of(mockDashboard));

    const action = DashboardActions.initDashboard();
    const completion = DashboardActions.loadDashboardSuccess({
      dashboard: mockDashboard,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(new DashboardEffects().loadDashboard$).toBeObservable(expected);
  });

  it('should filter dashboard by date range successfully', () => {
    const mockDashboard = createMockDashboard();
    mockDashboard.mainTransactionData.totalExpense = createMonetaryAmount(500);
    mockDashboard.mainTransactionData.totalIncome = createMonetaryAmount(1500);

    const filterRange = {
      startDate: moment('2025-07-01'),
      endDate: moment('2025-07-15'),
      dateRange: 'custom',
    };

    jest.spyOn(service, 'getDashboard').mockReturnValue(of(mockDashboard));

    const action = DashboardActions.dateRangeChange({ filterRange });
    const completion = DashboardActions.loadDashboardSuccess({
      dashboard: mockDashboard,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(new DashboardEffects().filterDashboard$).toBeObservable(expected);
    expect(service.getDashboard).toHaveBeenCalledWith(
      '2025-07-01T00:00:00',
      '2025-07-15T00:00:00',
    );
  });

  it('should handle date range filter with undefined dates', () => {
    const mockDashboard = createMockDashboard();

    const filterRange = {
      startDate: undefined,
      endDate: undefined,
      dateRange: 'lastWeek',
    };

    jest.spyOn(service, 'getDashboard').mockReturnValue(of(mockDashboard));

    const action = DashboardActions.dateRangeChange({ filterRange });
    const completion = DashboardActions.loadDashboardSuccess({
      dashboard: mockDashboard,
    });

    actions$ = hot('-a', { a: action });
    const expected = cold('-b', { b: completion });

    expect(new DashboardEffects().filterDashboard$).toBeObservable(expected);
    expect(service.getDashboard).toHaveBeenCalledWith(undefined, undefined);
  });

  it('should handle errors when loading dashboard', () => {
    const error = new Error('Error loading dashboard');
    jest
      .spyOn(service, 'getDashboard')
      .mockReturnValue(throwError(() => error));

    const action = DashboardActions.initDashboard();

    actions$ = hot('-a', { a: action });
    const expected = cold('-#', {}, error);

    expect(new DashboardEffects().loadDashboard$).toBeObservable(expected);
  });

  it('should handle errors when filtering dashboard', () => {
    const error = new Error('Error filtering dashboard');
    const filterRange = {
      startDate: moment('2025-07-01'),
      endDate: moment('2025-07-15'),
      dateRange: 'custom',
    };

    jest
      .spyOn(service, 'getDashboard')
      .mockReturnValue(throwError(() => error));

    const action = DashboardActions.dateRangeChange({ filterRange });

    actions$ = hot('-a', { a: action });
    const expected = cold('-#', {}, error);

    expect(new DashboardEffects().filterDashboard$).toBeObservable(expected);
  });
});
