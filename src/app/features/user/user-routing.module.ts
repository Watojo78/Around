import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '', 
    component: UserComponent,
    children: [
        { path: 'list', component: UserListComponent },
        { path: 'new', component: UserCreateComponent },
        { path: 'profile', component: UserProfileComponent},
        { path: ':id', component: UserDetailComponent},
        { path: ':id/edit', component: UserEditComponent },
        { path: '', redirectTo: 'list', pathMatch: 'full' }
      ]
    }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
