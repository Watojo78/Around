import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//material modules
import {MatMenuModule} from '@angular/material/menu';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTreeModule} from '@angular/material/tree';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [],

  imports: [
    CommonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule,
    FormsModule,
    MatTreeModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    GoogleMapsModule,
  ],

  exports: [
    CommonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatSlideToggleModule,
    FormsModule,
    MatTreeModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    GoogleMapsModule
  ],
})

export class SharedModule { }
