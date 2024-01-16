import { Directive, Input, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[disableOnIdMismatch]'
})
export class DisableOnIdMismatchDirective {
  @Input() currentUserId!: any;

  @HostBinding('disabled')
  get isDisabled(): boolean {
    const userId = (this.elementRef.nativeElement as HTMLElement).dataset['id'];
    return this.currentUserId !== userId;
  }

  constructor(private elementRef: ElementRef) {}
}