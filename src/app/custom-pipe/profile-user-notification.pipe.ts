import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ImageService } from '../services/image.service';

@Pipe({
  name: 'profileUserNotification'
})
export class ProfileUserNotificationPipe implements PipeTransform {
  constructor(private imgService: ImageService) {}

  transform(notification: any): Observable<string> {
    if (!notification || !notification.compteId) return of('');

    return this.imgService.getAccountImage(notification.compteId) // Use notification.compteId
      .pipe(
        map(image => {
          const contentType = image.type;
          const base64Data = image.donnees;
          return `data:${contentType};base64,${base64Data}`;
        }),
        catchError(() => of(''))
      );
  }
}
