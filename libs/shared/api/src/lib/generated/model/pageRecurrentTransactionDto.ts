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
import { PageableObject } from './pageableObject';
import { SortObject } from './sortObject';
import { RecurrentTransactionDto } from './recurrentTransactionDto';

export interface PageRecurrentTransactionDto {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  content?: Array<RecurrentTransactionDto>;
  number?: number;
  sort?: Array<SortObject>;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}
