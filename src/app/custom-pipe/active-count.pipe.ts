import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeCount'
})
export class ActiveCountPipe implements PipeTransform {

  
  transform(items: any[], activeField: string = 'active'): number {
    if (!items) {
      return 0; // Handle empty arrays
    }

    return items.filter(item => item[activeField] === true).length;
  }

}
