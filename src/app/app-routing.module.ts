import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowcaseComponent } from './showcase/showcase.component';
import { PrivacypolicyComponent } from './showcase/privacypolicy/privacypolicy.component';
import { AuthGuard } from './auth/auth-guard';
import { RestrictedComponent } from './restricted/restricted.component';

const routes: Routes = [

  { path: 'home', component: ShowcaseComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'restricted', component: RestrictedComponent},

  {
    path: "admauth",
    loadChildren: () =>
      import("./auth/auth.module").then(m => m.AuthModule)
  }, 

  {
    path: "dashboard",
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] },
    loadChildren: () =>
      import("./admindashboard/admindashboard.module").then(m => m.AdmindashboardModule)
  }, 
  
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },

  { 
    path: '**', 
    redirectTo: '/home', 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
