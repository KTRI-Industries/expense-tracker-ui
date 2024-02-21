import { TransactionDto } from '@expense-tracker-ui/api';
import CategoryEnum = TransactionDto.CategoryEnum;

export function mapToFilters(
  enumType: typeof CategoryEnum,
  labels: Record<any, any>,
): { value: CategoryEnum; label: string }[] {
  return Object.keys(enumType).map((key) => {
    let enumTypeElement: CategoryEnum =
      enumType[key as keyof typeof CategoryEnum];
    return {
      value: enumTypeElement,
      label: labels[enumTypeElement],
    };
  });
}

function mapToFiltersGeneric<T extends Record<string, any>>(
  enumType: T,
  labels: Record<keyof T, string>,
): { value: keyof T; label: string }[] {
  return Object.keys(enumType).map((key) => {
    let enumTypeElement: T[keyof T] = enumType[key as keyof T];
    return {
      value: enumTypeElement,
      label: labels[enumTypeElement as keyof T],
    };
  });
}
