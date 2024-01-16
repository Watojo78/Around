import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceCreateComponent } from './service-create/service-create.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceComponent } from './service.component';
import { SharedModule } from '../../Shared/shared.module';
import { ServiceDeleteComponent } from './service-delete/service-delete.component';



@NgModule({
  declarations: [
    ServiceListComponent,
    ServiceCreateComponent,
    ServiceEditComponent,
    ServiceDetailComponent,
    ServiceComponent,
    ServiceDeleteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
