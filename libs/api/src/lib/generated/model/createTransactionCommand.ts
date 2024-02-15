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

export interface CreateTransactionCommand {
  amount: MonetaryAmount;
  description?: string;
  date: string;
  category?: CreateTransactionCommand.CategoryEnum;
}
export namespace CreateTransactionCommand {
  export type CategoryEnum =
    | 'SALARY'
    | 'RENT'
    | 'GROCERIES'
    | 'ENTERTAINMENT'
    | 'BILL'
    | 'RESTAURANT'
    | 'TAXES'
    | 'SPORT'
    | 'GIFTS'
    | 'TRAVEL'
    | 'OTHER';
  export const CategoryEnum = {
    Salary: 'SALARY' as CategoryEnum,
    Rent: 'RENT' as CategoryEnum,
    Groceries: 'GROCERIES' as CategoryEnum,
    Entertainment: 'ENTERTAINMENT' as CategoryEnum,
    Bill: 'BILL' as CategoryEnum,
    Restaurant: 'RESTAURANT' as CategoryEnum,
    Taxes: 'TAXES' as CategoryEnum,
    Sport: 'SPORT' as CategoryEnum,
    Gifts: 'GIFTS' as CategoryEnum,
    Travel: 'TRAVEL' as CategoryEnum,
    Other: 'OTHER' as CategoryEnum,
  };
}