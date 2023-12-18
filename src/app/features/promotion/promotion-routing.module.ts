import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PromotionComponent } from './promotion.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { PromotionCreateComponent } from './promotion-create/promotion-create.component';
import { PromotionDetailComponent } from './promotion-detail/promotion-detail.component';
import { PromotionEditComponent } from './promotion-edit/promotion-edit.component';

const routes: Routes = [
  {
    path: '', 
    component: PromotionComponent,
    children: [
        { path: 'list', component: PromotionListComponent },
        { path: 'new', component: PromotionCreateComponent },
        { path: 'detail/:id', component: PromotionDetailComponent},
        { path: 'edit/:id', component: PromotionEditComponent },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionRoutingModule { }
