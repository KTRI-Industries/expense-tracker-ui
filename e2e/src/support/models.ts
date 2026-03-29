export interface TestCredentials {
  email: string;
  password: string;
}

export interface TransactionDraft {
  amount: number | string;
  date: string;
  description?: string;
}

export interface RecurrentTransactionDraft {
  amount: number | string;
  date: string;
  description?: string;
}
