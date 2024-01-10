import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excludeAdmin'
})
export class ExcludeAdminPipe implements PipeTransform {
  transform(items: any[]): any {
    return items.filter(item => item.role !== 'admin'); // Assuming a 'role' property for admin check
  }
}