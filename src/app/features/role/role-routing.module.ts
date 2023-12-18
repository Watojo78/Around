import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleComponent } from './role.component';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RoleEditComponent } from './role-edit/role-edit.component';

const roleRoutes: Routes = [
  {
    path: '', 
    component: RoleComponent,
    children: [
        { path: 'list', component: RoleListComponent },
        { path: 'new', component: RoleCreateComponent },
        { path: 'detail/:id', component: RoleDetailComponent},
        { path: 'edit/:id', component: RoleEditComponent },
      ]
    } 
];

@NgModule({
  imports: [RouterModule.forChild(roleRoutes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
