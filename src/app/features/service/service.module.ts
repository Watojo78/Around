import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceCreateComponent } from './service-create/service-create.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceComponent } from './service.component';
import { SharedModule } from '../../Shared/shared.module';



@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceCreateComponent,
    ServiceEditComponent,
    ServiceDetailComponent,
    ServiceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
