import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from '../../../services/service.service';

@Component({
  selector: 'app-service-delete',
  templateUrl: './service-delete.component.html',
  styleUrl: './service-delete.component.scss'
})
export class ServiceDeleteComponent implements OnInit{
  id!: number;
  serviceName!: string;

  constructor(
    private serService: ServiceService,
    public dialogRef: DialogRef<ServiceDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public serviceId: any,
    private snackBar: MatSnackBar) {}

    ngOnInit(): void {
      this.id = this.serviceId.id;
      this.getService(this.id);
    }

    private getService(id: number) {
      this.serService.getService(id)
      .subscribe({
        next:(shop) => {
          this.serviceName = shop.nomService
        },
        error: (err) => {
          console.log("Error getting shop",err);
          this.snackBar.open("Error getting shop", "OK", {duration: 5000});
        }
      })
    }

    deleteService(id: number){
      this.serService.delService(id)
      .subscribe({
        next:() => {
          console.log("Service supprimé avec succès ")
          this.snackBar.open('Service supprimé avec succès!', 'Suppression Réussie',
            {
              duration: 5000,
              panelClass: ['success-snackbar'] // Optional custom CSS class
            }
          );
          this.snackBar.open('La page va se rafraichir...')
          window.location.reload();
        },
        error: (err: any) => {
          this.snackBar.open('Error deleting shop: ' + err, 'Echec de suppression',
            {
              duration: 5000,
              panelClass: ['error-snackbar'] // Optional custom CSS class
            }
          );
          console.log("Unexpected error occurs while deleting the shop", err)
        }
      });
    }


}
