import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopCreateComponent } from './shop-create/shop-create.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ShopEditComponent } from './shop-edit/shop-edit.component';

const shopRoutes: Routes = [
  {
    path: '', 
    component: ShopComponent,
    children: [
        { path: 'list', component: ShopListComponent },
        { path: 'new', component: ShopCreateComponent },
        { path: ':id', component: ShopDetailComponent},
        { path: ':id/edit', component: ShopEditComponent },
      ]
    }  
];

@NgModule({
  imports: [RouterModule.forChild(shopRoutes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
