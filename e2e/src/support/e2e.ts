import './commands';
import type { RecurrentTransactionDraft, TransactionDraft } from './models';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      login(email: string, password: string): void;
      loginWithoutSession(email: string, password: string): void;
      addNewTransaction(transaction: TransactionDraft): void;
      editTransaction(transaction: TransactionDraft): void;
      editRecurrentTransaction(transaction: RecurrentTransactionDraft): void;
      deleteVisibleTransactions(): void;
      deleteVisibleRecurrentTransactions(): void;
      deleteAllInvitedUsers(): void;
      logout(): void;
      register(email: string, password: string): void;
      confirmRegistration(): void;
      acceptInvitation(): void;
      leaveTenant(): void;

      addNewRecurrentTransaction(transaction: RecurrentTransactionDraft): void;
      dismissPasskeyPrompt(): void;
    }
  }
}
