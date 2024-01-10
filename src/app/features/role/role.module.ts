import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleRoutingModule } from './role-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleComponent } from './role.component';
import { SharedModule } from '../../Shared/shared.module';


@NgModule({
  declarations: [
    RoleListComponent,
    RoleCreateComponent,
    RoleEditComponent,
    RoleComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RoleRoutingModule
  ]
})
export class RoleModule { }
