import { render, RenderResult, screen } from '@testing-library/angular';
import { HomepageComponent } from './homepage.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AuthActions, AuthSelectors } from '@expense-tracker-ui/shared/auth';
import {
  DashboardActions,
  DashboardSelectors,
} from '@expense-tracker-ui/dashboard';
import { MatCardModule } from '@angular/material/card';
import '@testing-library/jest-dom';
import { TestBed } from '@angular/core/testing';
import { CurrencyPipe } from '@angular/common';
import '@angular/common/locales/global/el';
import { userEvent } from '@testing-library/user-event';
import { take } from 'rxjs';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectModule } from '@ngx-formly/core/select';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { FormlyMatDatepickerModule } from '@ngx-formly/material/datepicker';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import {
  AmountInputComponent,
  ChipsComponent,
} from '@expense-tracker-ui/shared/formly';

describe('HomepageComponent', () => {
  let component: RenderResult<HomepageComponent>;
  let store: MockStore;

  const setup = async (isAuthenticated: boolean) => {
    component = await render(HomepageComponent, {
      imports: [
        MatCardModule,
        ReactiveFormsModule,
        FormlySelectModule,
        FormlyMaterialModule,
        FormlyMatDatepickerModule,
        FormlyModule.forRoot({
          types: [
            {
              name: 'chips',
              component: ChipsComponent,
              wrappers: ['form-field'],
              defaultOptions: { defaultValue: [] },
            },
            {
              name: 'amount-input',
              component: AmountInputComponent,
              wrappers: ['form-field'],
            },
          ],
          validationMessages: [
            { name: 'required', message: 'This field is required' },
          ],
        }),
      ],
      providers: [
        CurrencyPipe,
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
        provideMockStore({
          selectors: [
            {
              selector: AuthSelectors.selectIsLoggedIn,
              value: isAuthenticated,
            },
            { selector: DashboardSelectors.selectDashboard, value: null },
            { selector: DashboardSelectors.selectChartData, value: null },
          ],
        }),
      ],
    });
    store = TestBed.inject(MockStore);
    store.dispatch = jest.fn();
    return { dispatchSpy: store.dispatch };
  };

  it('should render the landing page when not authenticated', async () => {
    await setup(false);
    expect(
      screen.getByText('Manage Your Expenses with Ease.'),
    ).toBeInTheDocument();
  });

  it('should render the dashboard when authenticated', async () => {
    await setup(true);
    expect(
      screen.getByText('Welcome to the Expense Tracker'),
    ).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
    expect(screen.getByText('Expenses')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
    expect(screen.getByText('Transactions')).toBeInTheDocument();
  });

  it('should dispatch initDashboard action on init', async () => {
    await setup(true);
    store.scannedActions$.pipe(take(1)).subscribe((action) => {
      expect(action).toEqual(DashboardActions.initDashboard());
    });
  });

  it('should dispatch login action on login', async () => {
    const { dispatchSpy } = await setup(false);
    await userEvent.click(screen.getByText(/Login/i));
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.login());
  });
});
