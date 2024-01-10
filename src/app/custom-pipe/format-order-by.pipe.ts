import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatOrderBy'
})
export class FormatOrderByPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
