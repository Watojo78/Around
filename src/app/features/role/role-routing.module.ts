import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleComponent } from './role.component';
import { RoleListComponent } from './role-list/role-list.component';

const roleRoutes: Routes = [
  {
    path: '', 
    component: RoleComponent,
    children: [
        { path: 'list', component: RoleListComponent },
        { path: '', redirectTo: 'list', pathMatch: 'full' }
      ]
    } 
];

@NgModule({
  imports: [RouterModule.forChild(roleRoutes)],
  exports: [RouterModule]
})
export class RoleRoutingModule { }
