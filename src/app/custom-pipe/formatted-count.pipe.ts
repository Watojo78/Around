import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedCount'
})
export class FormattedCountPipe implements PipeTransform {

  transform(value: number, separator = ','): string {
    // Handle numbers less than 1000 with leading zeros
    if (value < 1000) {
      const minLength = 3; // Ensure minimum length of 3 for smaller numbers
      const stringValue = value?.toString().padStart(minLength, '0');
      return stringValue;
    } else {
      // Dynamic padding calculation for larger numbers
      const minLength = Math.ceil(Math.log10(value) + 1) + (Math.ceil(Math.log10(value) + 1) % 3);

      const stringValue = value?.toString().padStart(minLength, '0');
      const parts = stringValue.match(/\d{3}/g);
      return parts ? parts.join(separator) : '0';
    }
  }
}