import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../services/role.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {

  constructor(
    private roleService: RoleService,
    private dialogRef: DialogRef<RoleEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar) {}

  
  ngOnInit(): void {
  }

  updateRole(id:number, data: any) {
    this.roleService.updateRole(id, data)
      .subscribe({
        next: () => {
          this.dialogRef.close();
          this.snackBar.open('Role updated successfully!', 'Succès MAJ', {
            verticalPosition: 'top',
            duration: 2000
          });
        },
        error: () => {
          this.snackBar.open('Error updating role', 'Erreur MAJ', {
            verticalPosition: 'top',
            duration: 2000
          });
        }
      })
    }
}
