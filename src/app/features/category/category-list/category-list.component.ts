import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from '../../../services/category.service';
import { ShopService } from '../../../services/shop.service';
import { ServiceService } from '../../../services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private serService: ServiceService,
    private catService : CategoryService,
    private snackBar: MatSnackBar){}

    ngAfterViewInit() {
      this.fetchCats()
      this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    }

    private fetchCats(){
      this.catService.getAllCategories()
      .subscribe(res => {
        this.loadedCats = res;
        this.catsLength = this.loadedCats.length;
        this.dataSource = new MatTableDataSource(this.loadedCats);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
    }

    deleteCat(id: number){
      this.catService.delCategorie(id)
      .subscribe({
        next: () => {
          console.log("Catégorie supprimée avec succès ")
          this.snackBar.open(
            this.formatSnackbar('Category deleted successfully!', 'Deleted', 'Category'),
            '',
            {
              duration: 3000,
              panelClass: ['success-snackbar'] // Optional custom CSS class
            }
          );
          window.location.reload();
        },
        error: (err) => {
          this.snackBar.open(
            this.formatSnackbar('Error deleting category: ' + err.message, 'Error', 'Category'),
            '',
            {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional custom CSS class
            }
          );
          console.log("Erreur lors de la suppression de la catégorie", err.message)
        }
      });
    }

    private formatSnackbar(message: string, action: string, entityName: string): string {
      return `${action.toUpperCase()} ${entityName}: ${message}`;
    }


}
