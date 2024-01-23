import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit{
  changePassword!: FormGroup;
  hide: boolean = false;
  hide2: boolean = false;
  accountEmail!: string;

  constructor(
    private fb: FormBuilder,
    private accountService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private Email: any,
    private router: Router){}

  ngOnInit(): void {
    this.accountEmail= this.Email.email;
    console.log(this.accountEmail)
    this.changePassword = this.fb.group({
      oldPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
      newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40)
          ]
        ],
      //confirmPassword: ['', Validators.required]
    })
  }

  onSubmit(){
    console.log(this.changePassword.value)
    this.accountService.changePassword(this.accountEmail, this.changePassword.value)
    .subscribe({
      next: (res: any) => {
        console.log("Password changed successfully", res)
        this.snackBar.open("Mot de passe Mise à jour avec Succès", "Ok", {
          duration: 5000
        })
        this.router.navigate(['/dashboard/profile'])
      },
      error: (err: any) => {
        console.log("Error changing password", err)
        this.snackBar.open("Error lors de la Mise à jour du Mdp", "Ok")
      }
    })
  }
}
