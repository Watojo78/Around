import { UserService } from '../../services/user.service';
import { Component, AfterViewInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../services/notification.service';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/user';

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
  fname: any;
  lname: any;
  lastName: any;
  email: any;
  imgType: any;
  imgSrc: any;
  notifs: any;
  lastEightNotifs: any;
  notificationCount: any;
  loadingName = false;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";

  constructor(
    private authService: AuthService,
    private imgService: ImageService,
    private userService: UserService,
    private notificationsService: NotificationService){}

  ngAfterViewInit() {
    this.getCurrentUser();
    this.lastEightNotifs = this.fetchNotifications();
    this.lastEightNotifs?.subscribe((notifications: any[]) => {
      notifications.forEach((notification: { compteId: number; firstName: any; lastName: any; }) => {
        if (notification.compteId) {
          this.loadingName = true;
          this.getUserDetails(notification.compteId)
            .then(user => {
              notification.firstName = user.firstName;
              notification.lastName = user.lastName;
            })
            .finally(() => this.loadingName = false);
        }
      });
    });
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
  
  async getUserDetails(userId: number): Promise<any> {
    try {
      const userRes = await firstValueFrom(this.userService.getUser(userId));
      this.fname = userRes.firstName;
      this.lname = userRes.lastName;
      return this.fname + " " + this.lname;
    } catch (err) {
      console.log("Unexpected error while retrieving user", err);
      throw err; // Re-throw for handling in the caller
    }
  }

  private fetchNotifications(){
    this.notificationsService.getAllNotifications()
    .subscribe({
      next: (notificationsRes) => {
        this.notifs = notificationsRes;
        this.notificationCount = this.notifs.length;
        this.lastEightNotifs = this.notifs.slice(-8);
      },
      error: (err) => {
        console.log("Unexpected error while retreiving notifications", err);
      }
    })
  }

  onLogout(): void {
    this.authService.logout();
  }

}
