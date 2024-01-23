import { UserService } from '../../../services/user.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../../services/image.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  id!: number;
  profileId!: number;
  firstName: any;
  lastName: any;
  email: any;  
  active!: boolean;
  serviceIds: any;
  categorieId: any;
  notificationIds: any;
  password: any; 
  roleId: any;
  tel: any;
  numeroCni : any;
  shops: any;
  categories: any;
  imgType: any;
  imgSrc: any;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";

  constructor(
    private router: Router,
    private imgService: ImageService,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog){}

  ngOnInit(){
    this.getCurrentUser()
  }

  private getCurrentUser(){
    this.userService.getCurrentUser()
      .subscribe({
        next: (user) => {
          this.id = user.id;
          this.profileId = user.profileId;
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.email = user.email;
          this.roleId = user.roleId;
          this.tel =  user.tel;
          this.password = user.password;
          this.active = user.active;
          this.numeroCni = user.numeroCni;
          this.notificationIds = user.notificationIds;

          this.imgService.getAccountImage(this.id)
            .subscribe({
              next: (imgRes) => {
                this.imgType = imgRes.type;
                this.imgSrc = imgRes.donnees;
              },
              error:(err) => {
                console.log("Unexpected error while retreiving profile", err)
                this.snackbar.open("Une erreur est survenue lors de la recupération du profil", "Fermer", {duration: 5000})
              },
            })

        },
        error: (err) => {
          console.log("Unexpected error while retreiving profile details", err)
          this.snackbar.open("Une erreur est survenue lors de la recupération du profil", "Fermer", {duration: 5000}) 
        },
      });
  }

  openChangePassword(email: string){
    this.dialog.open(ChangePasswordComponent, {
      width: '490px',
      data: {email: email}
    });
  }
}
