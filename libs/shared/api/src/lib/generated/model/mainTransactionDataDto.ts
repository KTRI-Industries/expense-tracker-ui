/**
 * Expense Tracker
 * This the expense-tracker-core API
 *
 * The version of the OpenAPI document: v1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { MonetaryAmount } from './monetaryAmount';

export interface MainTransactionDataDto {
  totalIncome: MonetaryAmount;
  totalExpense: MonetaryAmount;
  totalBalance: MonetaryAmount;
  totalTransactions: number;
}
