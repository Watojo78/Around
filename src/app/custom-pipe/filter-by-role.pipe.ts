import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByRole'
})
export class FilterByRolePipe implements PipeTransform {
  transform(items: any[], roleId: number): any[] {
    return items.filter(item => item.roleId === roleId);
  }
}