import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopCreateComponent } from './shop-create/shop-create.component';
import { ShopEditComponent } from './shop-edit/shop-edit.component';
import { ShopDetailComponent } from './shop-detail/shop-detail.component';
import { ShopComponent } from './shop.component';
import { ShopListComponent } from './shop-list/shop-list.component';
import { ShopService } from '../../services/shop.service';
import { SharedModule } from '../../Shared/shared.module';
import { CustomPipeModule } from '../../custom-pipe/custom-pipe.module';
import { ShopDeleteComponent } from './shop-delete/shop-delete.component';
import { ShopActivateComponent } from './shop-activate/shop-activate.component';


@NgModule({
  declarations: [
    ShopCreateComponent,
    ShopEditComponent,
    ShopDetailComponent,
    ShopComponent,
    ShopListComponent,
    ShopDeleteComponent,
    ShopActivateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomPipeModule,
    ShopRoutingModule
  ],
  providers: [
    ShopService,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ShopModule { }
