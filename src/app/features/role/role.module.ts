import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleComponent } from './role.component';
import { SharedModule } from '../../Shared/shared.module';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleDeleteComponent } from './role-delete/role-delete.component';
import { CustomPipeModule } from '../../custom-pipe/custom-pipe.module';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateComponent,
    RoleEditComponent,
    RoleComponent,
    RoleDetailComponent,
    RoleDeleteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CustomPipeModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
