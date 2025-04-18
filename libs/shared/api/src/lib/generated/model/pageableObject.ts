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
import { SortObject } from './sortObject';

export interface PageableObject {
  offset?: number;
  sort?: Array<SortObject>;
  pageNumber?: number;
  pageSize?: number;
  unpaged?: boolean;
  paged?: boolean;
}
