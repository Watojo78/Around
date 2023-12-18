import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class TokenDecoderService {
  decodeToken(token: any): any {
    const tokenParts = token.split('.');
    const payloadBase64 = tokenParts[1];
    const payloadJson = JSON.parse(atob(payloadBase64));
    return payloadJson;
  }

  getAuthorities(decodedToken: any): string[] {
    return decodedToken.authorities.map((authority: { authority: any; }) => authority.authority);
  }
}