import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionRoutingModule } from './promotion-routing.module';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionCreateComponent } from './promotion-create/promotion-create.component';
import { PromotionEditComponent } from './promotion-edit/promotion-edit.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { PromotionComponent } from './promotion.component';


@NgModule({
  declarations: [
    PromotionListComponent,
    PromotionCreateComponent,
    PromotionEditComponent,
    PromotionDetailComponent,
    PromotionComponent
  ],
  imports: [
    CommonModule,
    PromotionRoutingModule
  ]
})
export class PromotionModule { }
