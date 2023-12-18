import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CityRoutingModule } from './city-routing.module';
import { CityListComponent } from './city-list/city-list.component';
import { CityCreateComponent } from './city-create/city-create.component';
import { CityEditComponent } from './city-edit/city-edit.component';
import { CityDetailComponent } from './city-detail/city-detail.component';
import { CityComponent } from './city.component';


@NgModule({
  declarations: [
    CityListComponent,
    CityCreateComponent,
    CityEditComponent,
    CityDetailComponent,
    CityComponent
  ],
  imports: [
    CommonModule,
    CityRoutingModule
  ]
})
export class CityModule { }
