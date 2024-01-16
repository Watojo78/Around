import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShopService } from '../../../services/shop.service';

@Component({
  selector: 'app-shop-delete',
  templateUrl: './shop-delete.component.html',
  styleUrl: './shop-delete.component.scss'
})
export class ShopDeleteComponent implements OnInit {
  id!: number;
  shopName!: string;

  constructor(
    private shopService: ShopService,
    private dialogRef: DialogRef<ShopDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public shopId: any,
    private snackBar: MatSnackBar) {}

  
  ngOnInit(): void {
    this.id = this.shopId.id;
    this.getShop(this.id);
  }

  private getShop(id: number){
    this.shopService.getShopDetail(id)
    .subscribe({
      next:(shop) => {
        this.shopName = shop.nomBoutique
      },
      error: (err) => {
        console.log("Error getting shop",err);
        this.snackBar.open("Error getting shop", "OK", {duration: 5000});
      }
    })
  }

  deleteShop(id: number){
    this.shopService.deleteShop(id)
    .subscribe({
      next:() => {
        console.log("Boutique supprimée avec succès ")
        this.snackBar.open('Boutique supprimée avec succès!', 'Suppression Réussie',
          {
            duration: 3000,
            panelClass: ['success-snackbar'] // Optional custom CSS class
          }
        );
        this.snackBar.open('La page va se rafraichir...')
      },
      error: (err) => {
        this.snackBar.open('Error deleting shop: ' + err, 'Echec de suppression',
          {
            duration: 5000,
            panelClass: ['error-snackbar'] // Optional custom CSS class
          }
        );
        console.log("Unexpected error occurs while deleting the shop", err)
      },
      complete: () => {
        this.dialogRef.close();
        window.location.reload();
      }
    });
  }
}
