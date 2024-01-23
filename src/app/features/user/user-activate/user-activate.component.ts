import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-activate',
  templateUrl: './user-activate.component.html',
  styleUrl: './user-activate.component.scss'
})
export class UserActivateComponent implements OnInit {
  email!: string;
  initAccountActivate: FormGroup;

  constructor(
    private snackbar: MatSnackBar,
    private accountService: UserService,
    private dialogRef: DialogRef<UserActivateComponent>,
    @Inject(MAT_DIALOG_DATA) private Email: any,
    private fb: FormBuilder) {
    this.initAccountActivate = this.fb.group({
      email: this.Email.email,
    });
  }

  ngOnInit(): void {
    this.email = this.Email.email;
  }

  onFormSubmit(){
    if(this.initAccountActivate.valid){
      console.log("email", this.initAccountActivate.value.email);
      this.accountService.initiateActivation(this.initAccountActivate.value.email)
        .subscribe({
          next: (res) => {
            this.snackbar.open(res, 'Succès', {
              duration: 4000
            })
            this.dialogRef.close(res);
            /*this.accountService.verifyActivation(this.email)
              .subscribe({
                next: (res) => {
                  this.snackbar.open('Vérification réussie, le compte a été activée avec succès! :)', 'Succès', {
                    duration: 4000
                  })
                },
                error: (err) => {
                  this.snackbar.open('Echec lors de la Vérification'+err, 'Echec', {
                    duration: 4000
                  })
                }
              })*/
          },
          error: (err) => {
            console.log('voici lerreur: ',err)
            this.snackbar.open('Echec Initialisation', 'Echec')
          }
        })
    }
  }
}
