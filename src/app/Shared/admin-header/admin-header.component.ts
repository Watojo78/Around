import { UserService } from '../../services/user.service';
import { Component, AfterViewInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements AfterViewInit {
  currentUser: any;
  userId: any;
  profileId: any;
  firstName: any;
  lastName: any;
  email: any;
  imgType: any;
  imgSrc: any;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";

  constructor(
    private authService: AuthService,
    private imgService: ImageService,
    private userService: UserService){}

  ngAfterViewInit() {
    this.getCurrentUser()
  }

  private getCurrentUser(){
    this.userService.getCurrentUser()
    .subscribe({
      next: (userRes) => {
        this.userId = userRes.id;
        this.profileId = userRes.profileId;
        this.firstName = userRes.firstName;
        this.lastName = userRes.lastName;
        this.email = userRes.email;

        this.imgService.getAccountImage(this.userId)
        .subscribe({
          next: (imgRes)=>{
            this.imgType = imgRes.type;
            this.imgSrc = imgRes.donnees;
          },
          error(err) {
            console.log("Unexpected error while retreiving profile", err)
          },
        })
      },
      error(err) {
        console.log("Unexpected error while retreiving current user", err);
      },
    });
  }  

  onLogout(): void {
    this.authService.logout();
  }

}
