import { Pipe, PipeTransform } from '@angular/core';

/**
 * Given an enum value and a record mapping enum to string,
 * returns the string mapped to specific enum value.
 */
@Pipe({
  name: 'enumToLabel',
  standalone: true,
})
export class EnumToLabelPipe implements PipeTransform {
  transform(value: unknown, map: Record<any, string>): string {
    const enumElement: string =
      Object.keys(map).find((key) => key == value) ?? '';
    return map[enumElement];
  }
}
