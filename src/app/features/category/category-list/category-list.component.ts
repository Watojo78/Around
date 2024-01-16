import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryDeleteComponent } from '../category-delete/category-delete.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements AfterViewInit {
  displayedColumns: string[] = ['nomCategorie', 'description', 'actions'];
  loadedCats: any;
  catsLength: any;
  sortedData: any;
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private catService : CategoryService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog){}

    ngAfterViewInit() {
      this.fetchCats()
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    }

    private fetchCats(){
      this.catService.getAllCategories()
      .subscribe({
        next: (res) => {
          this.loadedCats = res;
          this.catsLength = this.loadedCats.length;
          this.dataSource = new MatTableDataSource(this.loadedCats);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.snackBar.open("Erreur lors du chargement des catégories", err, 
          {
            duration: 4000,
          })
          console.log("Erreur lors du chargement des catégories",err)
        }
      }
    )
    }

    confirmCatDeletion(id: number){
      this.dialog.open(CategoryDeleteComponent, {
        width: 'auto',
        data: {id: id}
      });
    }

}
