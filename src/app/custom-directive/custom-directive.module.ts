import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisableOnIdMismatchDirective } from './disable-on-id-mismatch.directive';



@NgModule({
  declarations: [
    DisableOnIdMismatchDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DisableOnIdMismatchDirective
  ]
})
export class CustomDirectiveModule { }
