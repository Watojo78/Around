import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryComponent } from './category.component';
import { SharedModule } from '../../Shared/shared.module';
import { CategoryDeleteComponent } from './category-delete/category-delete.component';


@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryCreateComponent,
    CategoryEditComponent,
    CategoryDetailComponent,
    CategoryComponent,
    CategoryDeleteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CategoryRoutingModule
  ]
})
export class CategoryModule { }
