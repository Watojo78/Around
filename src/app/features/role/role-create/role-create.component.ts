import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleService } from '../../../services/role.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.scss']
})
export class RoleCreateComponent {
  roleForm:FormGroup;

  constructor(
    private roleService: RoleService,
    private snackbar: MatSnackBar,
    private dialogRef: DialogRef<RoleCreateComponent>,
    private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      name: 'Role test',
    });
  }

  onFormSubmit(){
    if(this.roleForm.valid){
      console.log(this.roleForm.value);
      this.roleService.newRole(this.roleForm.value)
        .subscribe({
          next: (res) => {
            this.snackbar.open('Role Créé avec succès!', 'Succès Création', {
              duration: 4000
            })
            this.dialogRef.close(res);
            window.location.reload();
          },
          error: (err) => {
            console.log('Erreur lors de la création du role! :(',err)
            this.snackbar.open('Erreur lors de la création du role!'+err, 'Erreur Création', {
              duration: 4000
            })
          }
        })
    }
  }

}
