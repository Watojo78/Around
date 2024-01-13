import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryDetailComponent } from './category-detail/category-detail.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

const routes: Routes = [
  {
    path: '', 
    component: CategoryComponent,
    children: [
        { path: 'list', component: CategoryListComponent },
        { path: 'new', component: CategoryCreateComponent },
        { path: ':id', component: CategoryDetailComponent},
        { path: ':id/edit', component: CategoryEditComponent },
        { path: '', redirectTo: 'list', pathMatch: 'full' }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
