import { Component, Inject, OnInit } from '@angular/core';
import { RoleService } from '../../../services/role.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-role-delete',
  templateUrl: './role-delete.component.html',
  styleUrl: './role-delete.component.scss'
})
export class RoleDeleteComponent implements OnInit {
  id!: number;

  constructor(
    private roleService: RoleService,
    private dialogRef: DialogRef<RoleDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public roleId: any,
    private snackBar: MatSnackBar) {}

  
  ngOnInit(): void {
    this.id = this.roleId.id;
  }

  deleteRole(id: number){
    this.roleService.delRole(id)
      .subscribe({
        next: (res) => {
          this.snackBar.open("Rôle supprimé avec succès", "Succès");
          this.dialogRef.close(res);
          window.location.reload();
        },
        error: (err) => {
          this.snackBar.open("Erreur lors de la suppression du rôle", "Ereur", err.message);
          console.log("Une erreur innattendue est survenue lors de la tentative de suppression",err.message);
        }
      });
  }
}