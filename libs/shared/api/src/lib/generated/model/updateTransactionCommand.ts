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
import { Category } from './category';
import { MonetaryAmount } from './monetaryAmount';

export interface UpdateTransactionCommand {
  transactionId: string;
  amount: MonetaryAmount;
  description?: string;
  date: string;
  categories?: Array<Category>;
}
