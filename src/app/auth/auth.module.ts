import { NgModule } from '@angular/core';
import { SharedModule } from '../Shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent
  ],
  imports: [
    AuthRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ]
})
export class AuthModule { }
