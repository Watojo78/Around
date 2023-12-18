import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from './auth.service';
import { TokenDecoderService } from './token-decoder.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private router: Router,
    private authService: AuthService,
    private decoder: TokenDecoderService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isLoggedIn()) {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    const decodedToken = this.decoder.decodeToken(this.authService.getToken());
    const userRoles = this.decoder.getAuthorities(decodedToken);

    const requiredRoles = route.data?.['roles'] || [];
    if (userRoles.includes('ADMIN') || userRoles.some((role: any) => requiredRoles.includes(role))) {
      return true;
    }
    sessionStorage.removeItem('token');
    return this.router.createUrlTree(['/restricted'], { queryParams: { returnUrl: state.url } });
  }
}