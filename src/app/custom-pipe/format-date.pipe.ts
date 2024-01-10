import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  transform(dateStr: string): string {
    const dateObj = new Date(dateStr);
    const currentYear = new Date().getFullYear();

    // Show only day and 1st 3 digits of month if it's the current year
    if (dateObj.getFullYear() === currentYear) {
      return `${dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric' })} à ${dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    }

    // Show full date with year otherwise
    return `${dateObj.toLocaleDateString('default', { month: 'short', day: 'numeric', year: '2-digit' })} à ${dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
}