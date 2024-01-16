import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../services/role.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss'
})
export class RoleDetailComponent implements OnInit {
  id!: number;
  role: any;

  constructor(
    private roleService: RoleService,
    private dialogRef: DialogRef<RoleDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public roleId: any,
    private snackBar: MatSnackBar) {}

  
    ngOnInit(): void {
      this.id = this.roleId.id;
      this.roleDetail(this.id);
    }

    roleDetail(id: number) {
      this.roleService.getRole(id)
        .subscribe({
          next: (response) => {
            this.role = response;
          },
          error: (err: any) => {
            this.snackBar.open("Erreur lors de la lecture du rôle", "Erreur", err);
          }
        })
    }
}
