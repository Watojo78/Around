import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-delete',
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.scss'
})
export class CategoryDeleteComponent implements OnInit{
  id!: number;
  categoryName!: string;

  constructor(
    private categoryService: CategoryService,
    private dialogRef: DialogRef<CategoryDeleteComponent>,
    @Inject(MAT_DIALOG_DATA)  public catId: any,
    private snackBar: MatSnackBar){}

    ngOnInit(): void {
      this.id = this.catId.id;
      this.getCategory(this.id)
    }

    private getCategory(id: number) {
      this.categoryService.getCategorie(id)
      .subscribe({
        next: (data) => {
          this.categoryName = data.nomCategorie;
        },
        error: (err) => {
          console.log("Error getting category",err);
          this.snackBar.open("Error getting category", "OK", {duration: 5000});
        },
      })
    }

    deleteCategory(id: number){
      this.categoryService.delCategorie(id)
      .subscribe({
        next:() => {
          console.log("Catégorie supprimée avec succès ")
          this.snackBar.open('Catégorie supprimée avec succès!', 'Fermer',
            {
              duration: 3000,
              panelClass: ['success-snackbar'] // Optional custom CSS class
            }
          );
          this.snackBar.open('La page va se rafraichir...')
        },
        error: (err) => {
          this.snackBar.open('Error deleting category: ' + err, 'Echec de suppression',
            {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional custom CSS class
            }
          );
          console.log("Unexpected error occurs while deleting the category", err)
        },
        complete: () => {
          this.dialogRef.close();
          window.location.reload();
        }
      });
    }
}
