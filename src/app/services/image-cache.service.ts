import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageCacheService {

  private cachedImages: { [key: number]: string } = {};

  get(userId: number): string | null {
    return this.cachedImages[userId] || null;
  }

  set(userId: number, imageUrl: string): void {
    this.cachedImages[userId] = imageUrl;
  }

  clear(): void {
    this.cachedImages = {};
  }
}