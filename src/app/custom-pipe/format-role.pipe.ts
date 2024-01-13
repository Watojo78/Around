import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatRole'
})
export class FormatRolePipe implements PipeTransform {

  transform(role: string, customTransform?: (role: string) => string): string {
    if (!role) return '';

    const transformedRole = customTransform ? customTransform(role) : role.toLowerCase();

    // Implement general formatting logic here (capitalize first letter, etc.)
    return transformedRole.charAt(0).toUpperCase() + transformedRole.slice(1);
  }
}