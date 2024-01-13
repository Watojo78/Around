import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatOpenHourDay'
})
export class FormatOpenHourDayPipe implements PipeTransform {

  transform(value: string): string {
    // Check for valid input
    if (!value || typeof value !== 'string') {
      return value;
    }

    const englishDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const frenchDays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    const lowerValue = value.toLowerCase(); // Case-insensitive matching
    const index = englishDays.indexOf(lowerValue);

    if (index !== -1) {
      return frenchDays[index].charAt(0).toUpperCase() + frenchDays[index].slice(1); // Capitalize first letter
    } else {
      return value; // Return original value if not a valid English day
    }
  }
}
