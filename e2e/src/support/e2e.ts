import './commands';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface Chainable<Subject> {
      login(email: string, password: string): void;
      loginWithoutSession(email: string, password: string): void;
      addNewTransaction(transaction: any): void;
      editTransaction(transaction: any): void;
      deleteVisibleTransactions(): void;
      deleteAllInvitedUsers(): void;
      logout(): void;
      register(email: string, password: string): void;
      confirmRegistration(): void;
      acceptInvitation(username: string): void;
      leaveTenant(): void;
    }
  }
}
