import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortAndPaginate'
})
export class SortAndPaginatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
