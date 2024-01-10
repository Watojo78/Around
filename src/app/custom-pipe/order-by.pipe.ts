import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
  transform(value: any[], field: string, descending?: boolean): any[] {
    if (!value || !value.length) {
      return value;
    }

    const isDescending = descending === true;

    return value.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // Handle potential undefined values
      if (aValue === undefined && bValue === undefined) {
        return 0;
      } else if (aValue === undefined) {
        return 1; // Place undefined values at the end
      } else if (bValue === undefined) {
        return -1;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return isDescending ? comparison * -1 : comparison;
    });
  }
}