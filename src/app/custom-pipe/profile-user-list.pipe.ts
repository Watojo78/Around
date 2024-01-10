import { Pipe, PipeTransform } from '@angular/core';
import { Observable, of, map, catchError } from 'rxjs';
import { ImageService } from '../services/image.service';

@Pipe({
  name: 'profileUserList'
})
export class ProfileUserListPipe implements PipeTransform {
  constructor(private imgService: ImageService) {}

  transform(user: any): Observable<string> {
    if (!user || !user.profileId) return of('');

    return this.imgService.getAccountImage(user.id)
      .pipe(
        map(image => {
          const contentType = image.type;
          const base64Data = image.donnees;
          return `data:${contentType};base64,${base64Data}`; // Combine for complete URL
        }),
        catchError(() => of(''))
      );
  }

}
