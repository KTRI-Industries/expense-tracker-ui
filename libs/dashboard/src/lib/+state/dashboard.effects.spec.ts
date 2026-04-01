import { Actions } from '@ngrx/effects';
import { Action, ActionsSubject, Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of, Subscription, throwError } from 'rxjs';
import moment from 'moment';
import { DashboardEffects } from './dashboard.effects';
import { DashboardActions } from './dashboard.actions';
import { DashboardService } from '../dashboard.service';
import { DashboardDto, MonetaryAmount } from '@expense-tracker-ui/shared/api';
import { AccountSelectors } from '@expense-tracker-ui/account';

describe('DashboardEffects', () => {
  let actions$: ActionsSubject;
  let currentAccount$: BehaviorSubject<string | undefined>;
  let effects: DashboardEffects;
  let service: jest.Mocked<Pick<DashboardService, 'getDashboard'>>;
  let store: Pick<Store, 'select'>;
  let subscriptions: Subscription[];

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
    actions$ = new ActionsSubject();
    currentAccount$ = new BehaviorSubject<string | undefined>('tenant-id');
    subscriptions = [];
    service = {
      getDashboard: jest.fn(),
    };
    store = {
      select: jest.fn((selector) => {
        if (selector === AccountSelectors.selectCurrentAccount) {
          return currentAccount$.asObservable();
        }

        return of(undefined);
      }),
    };

    effects = new DashboardEffects(
      store as Store,
      actions$ as unknown as Actions,
      service as unknown as DashboardService,
    );
  });

  afterEach(() => {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
    actions$.complete();
    currentAccount$.complete();
  });

  function collect(effect$: Observable<Action>) {
    const emittedActions: Action[] = [];
    subscriptions.push(effect$.subscribe((action) => emittedActions.push(action)));

    return emittedActions;
  }

  it('loads the dashboard when initDashboard fires and an account is available', () => {
    const dashboard = createMockDashboard();
    service.getDashboard.mockReturnValue(of(dashboard));
    const emittedActions = collect(effects.loadDashboard$);

    actions$.next(DashboardActions.initDashboard());

    expect(service.getDashboard).toHaveBeenCalledTimes(1);
    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardSuccess({ dashboard }),
    ]);
  });

  it('waits for the current account to become available before loading the dashboard', () => {
    const dashboard = createMockDashboard();
    service.getDashboard.mockReturnValue(of(dashboard));
    currentAccount$.next(undefined);
    const emittedActions = collect(effects.loadDashboard$);

    actions$.next(DashboardActions.initDashboard());

    expect(service.getDashboard).not.toHaveBeenCalled();

    currentAccount$.next('tenant-id');

    expect(service.getDashboard).toHaveBeenCalledTimes(1);
    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardSuccess({ dashboard }),
    ]);
  });

  it('dispatches loadDashboardFailure when dashboard loading fails', () => {
    const error = new Error('Error loading dashboard');
    service.getDashboard.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.loadDashboard$);

    actions$.next(DashboardActions.initDashboard());

    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardFailure({ error }),
    ]);
  });

  it('loads a filtered dashboard with formatted dates', () => {
    const dashboard = createMockDashboard();
    const filterRange = {
      startDate: moment('2025-07-01'),
      endDate: moment('2025-07-15'),
      dateRange: 'custom' as const,
    };
    service.getDashboard.mockReturnValue(of(dashboard));
    const emittedActions = collect(effects.filterDashboard$);

    actions$.next(DashboardActions.dateRangeChange({ filterRange }));

    expect(service.getDashboard).toHaveBeenCalledWith(
      '2025-07-01T00:00:00',
      '2025-07-15T00:00:00',
    );
    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardSuccess({ dashboard }),
    ]);
  });

  it('passes undefined dates through when the selected range has no explicit boundaries', () => {
    const dashboard = createMockDashboard();
    service.getDashboard.mockReturnValue(of(dashboard));
    const emittedActions = collect(effects.filterDashboard$);

    actions$.next(
      DashboardActions.dateRangeChange({
        filterRange: {
          startDate: undefined,
          endDate: undefined,
          dateRange: 'lastWeek',
        },
      }),
    );

    expect(service.getDashboard).toHaveBeenCalledWith(undefined, undefined);
    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardSuccess({ dashboard }),
    ]);
  });

  it('dispatches loadDashboardFailure when filtering fails', () => {
    const error = new Error('Error filtering dashboard');
    service.getDashboard.mockReturnValue(throwError(() => error));
    const emittedActions = collect(effects.filterDashboard$);

    actions$.next(
      DashboardActions.dateRangeChange({
        filterRange: {
          startDate: moment('2025-07-01'),
          endDate: moment('2025-07-15'),
          dateRange: 'custom',
        },
      }),
    );

    expect(emittedActions).toEqual([
      DashboardActions.loadDashboardFailure({ error }),
    ]);
  });
});
