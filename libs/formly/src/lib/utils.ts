import { Category } from '@expense-tracker-ui/api';

export function mapToFilters(
  enumType: typeof Category,
  labels: Record<any, any>,
): { value: Category; label: string }[] {
  return Object.keys(enumType).map((key) => {
    const enumTypeElement: Category = enumType[key as keyof typeof Category];
    return {
      value: enumTypeElement,
      label: labels[enumTypeElement],
    };
  });
}

/**
 * This function maps an enum to a set of filters. Every enum value is mapped to a label for presentation purposes.
 *
 * @template T - A string literal type representing the enum values.
 *
 * @param {Record<string, T>} enumType - An object representing the enum. The keys are the enum keys and the values are the enum values.
 * @param {Record<T, string>} labels - An object mapping the enum values to their corresponding labels. The keys are the enum values and the values are the labels.
 *
 * @returns {Array<{ value: T; label: string }>} - An array of objects. Each object represents a filter and has a `value` property (the enum value) and a `label` property (the corresponding label).
 */
export function mapToFiltersGeneric<T extends string>(
  enumType: Record<string, T>,
  labels: Record<T, string>,
): Chip<T>[] {
  return Object.keys(enumType).map((key) => ({
    value: enumType[key],
    label: labels[enumType[key]],
  }));
}

export interface Chip<T> {
  value: T;
  label: string;
}
