import { SharedModule } from './../../Shared/shared.module';
import { NgModule } from '@angular/core';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CustomPipeModule } from '../../custom-pipe/custom-pipe.module';
import { UserService } from '../../services/user.service';
import { CustomDirectiveModule } from '../../custom-directive/custom-directive.module';


@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserCreateComponent,
    UserEditComponent,
    UserDetailComponent,
    UserProfileComponent,
  ],
  imports: [
    UserRoutingModule,
    SharedModule,
    HttpClientModule,
    CustomPipeModule,
    CustomDirectiveModule
  ],
  
  providers: [
    UserService
  ],
})
export class UserModule { }
