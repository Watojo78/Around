import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CityComponent } from './city.component';
import { CityListComponent } from './city-list/city-list.component';
import { CityCreateComponent } from './city-create/city-create.component';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { CityEditComponent } from './city-edit/city-edit.component';

const routes: Routes = [
  {
    path: '', 
    component: CityComponent,
    children: [
        { path: 'list', component: CityListComponent },
        { path: 'new', component: CityCreateComponent },
        { path: 'detail/:id', component: CityDetailComponent},
        { path: 'edit/:id', component: CityEditComponent },
        { path: '', redirectTo: 'list', pathMatch: 'full' },
        { path: '**', redirectTo: 'list', pathMatch: 'full' }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CityRoutingModule { }
