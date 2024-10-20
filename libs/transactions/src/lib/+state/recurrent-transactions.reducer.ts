import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import {
  PageRecurrentTransactionDto,
  RecurrenceFrequency,
  RecurrentTransactionDto,
} from '@expense-tracker-ui/shared/api';
import { RecurrentTransactionActions } from './transactions.actions';
import { AuthSelectors } from '@expense-tracker-ui/shared/auth';

export const TRANSACTIONS_FEATURE_KEY = 'recurrentTransactions';

export interface RecurrentTransactionsState {
  recurrentTransactions: PageRecurrentTransactionDto | undefined;
  selectedTransactionId: string | null;
}

export const initialRecurrentTransactionsState: RecurrentTransactionsState = {
  recurrentTransactions: undefined,
  selectedTransactionId: null,
};

const initialTransaction: RecurrentTransactionDto = {
  amount: {
    currency: 'EUR',
    amount: undefined,
  },
  recurrencePeriod: {
    startDate: '',
    frequency: RecurrenceFrequency.Daily,
  },
  description: '',
  recurrentTransactionId: '',
  tenantId: '',
  userId: '',
};

export const recurrentTransactionsFeature = createFeature({
  name: TRANSACTIONS_FEATURE_KEY,
  reducer: createReducer(
    initialRecurrentTransactionsState,
    on(
      RecurrentTransactionActions.loadRecurrentTransactionsSuccess,
      (state, { recurrentTransactions }) => ({
        ...state,
        recurrentTransactions,
      }),
    ),
    on(RecurrentTransactionActions.openRecurrentTransactionFrom, (state) => ({
      ...state,
      selectedTransactionId: null, // otherwise the form will be prefilled with the last selected transaction
    })),
    on(
      RecurrentTransactionActions.createNewRecurrentTransactionSuccess,
      (state) => ({
        ...state,
        recurrentTransactions: undefined, // otherwise the list of recurrentTransactions won't be updated
      }),
    ),
    on(
      RecurrentTransactionActions.editRecurrentTransaction,
      (state, { recurrentTransactionId }) => ({
        ...state,
        selectedTransactionId: recurrentTransactionId,
      }),
    ),
    on(
      RecurrentTransactionActions.loadRecurrentTransaction,
      (state, { recurrentTransactionId }) => ({
        ...state,
        selectedTransactionId: recurrentTransactionId,
      }),
    ),
    on(
      RecurrentTransactionActions.loadRecurrentTransactionSuccess,
      (state, { recurrentTransaction }) => ({
        ...state,
        recurrentTransactions: {
          ...state.recurrentTransactions,
          content: [
            ...(state?.recurrentTransactions?.content ?? []),
            recurrentTransaction,
          ],
        },
      }),
    ),
  ),
  extraSelectors: ({
    selectRecurrentTransactions,
    selectSelectedTransactionId,
  }) => ({
    selectCurrentRecurrentTransaction: createSelector(
      selectRecurrentTransactions,
      selectSelectedTransactionId,
      (recurrentTransactions, selectedTransactionId) => {
        // this is only needed for the case of new transaction where we do not have a selected tx id, but we still want to render the component.
        // so we return an initial transaction instead of undefined...
        if (selectedTransactionId === null) {
          return initialTransaction;
        }
        return recurrentTransactions?.content?.find(
          (t) => t.recurrentTransactionId === selectedTransactionId,
        );
      },
    ),
    selectAugmentedRecurrentTransactions: createSelector(
      AuthSelectors.selectTenantUsers,
      selectRecurrentTransactions,
      // add user email to each transaction
      (tenantUsers, recurrentTransactions) => ({
        ...recurrentTransactions,
        content: recurrentTransactions?.content?.map((t) => ({
          ...t,
          email: tenantUsers.find((u) => u.userId === t.userId)?.email,
        })),
      }),
    ),
  }),
});
