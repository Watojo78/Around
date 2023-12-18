import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceComponent } from './service.component';
import { ServiceListComponent } from './service-list/service-list.component';
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { ServiceEditComponent } from './service-edit/service-edit.component';
import { ServiceCreateComponent } from './service-create/service-create.component';

const serviceRoutes: Routes = [
  {
    path: '', 
    component: ServiceComponent,
    children: [
        { path: 'list', component: ServiceListComponent },
        { path: 'new', component: ServiceCreateComponent },
        { path: ':id', component: ServiceDetailComponent},
        { path: ':id/edit', component: ServiceEditComponent },
        { 
          path: 'category', 
          loadChildren: () =>
          import("../../features/category/category.module").then(m => m.CategoryModule)
        },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(serviceRoutes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
