import { UserService } from '../../../services/user.service';
import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ServiceService } from '../../../services/service.service';
import { ShopService } from '../../../services/shop.service';
import { map } from 'rxjs';
import { ImageService } from '../../../services/image.service';

const token = sessionStorage.getItem('token');
const headers = new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set('Authorization', `Bearer ${token}`)

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
  boutiqueIds : any;
  serviceIds: any;
  categorieId: any;
  notificationIds: any;
  password: any; 
  roleId: any;
  tel: any;
  numeroCni : any;
  shops: any;
  categories: any;
  services: any;
  imgType: any;
  imgSrc: any;
  defaultSrc= "../../../assets/avatar_pp_icon.svg";

  constructor(
    private router: Router,
    private imgService: ImageService,
    private userService: UserService,
    private shopService: ShopService,
    private serService: ServiceService,
    private catService: CategoryService,
    private route: ActivatedRoute){}

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
        this.boutiqueIds = user.boutiqueIds;
        this.notificationIds = user.notificationIds;

        this.imgService.getAccountImage(this.id)
        .subscribe({
          next: (imgRes) => {
            this.imgType = imgRes.type;
            this.imgSrc = imgRes.donnees;
          },
          error(err) {
            console.log("Unexpected error while retreiving profile", err)
          },
        })

        // Fetch shops using boutiqueIds
        if (this.boutiqueIds.length > 0) {
          const shopPromises = this.boutiqueIds.map((boutiqueId: number) => {
            return this.shopService.getShopDetail(boutiqueId).toPromise();
          });

          Promise.all(shopPromises)
            .then((shops) => {
              this.shops = shops;

              //Check if shops is undefined
              if (this.shops && this.shops.length > 0) {
                // Group services by category
                const groupedServices = this.shops.reduce((acc: { [x: string]: { categorieId: string | number; }[]; }, shop: { services: { categorieId: string | number; }[]; }) => {
                  shop.services.forEach((service: { categorieId: string | number; }) => {
                    acc[service.categorieId].push(service);
                  });
                  return acc;
                }, {});

                // Display services
                this.categories = Object.keys(groupedServices);
                this.services = [];
                for (const category of this.categories) {
                  this.services.push({
                    category,
                    services: groupedServices[category]
                  });
                }
              }
            })
          .catch((error) => {
            console.error('Error fetching shops:', error);
          });
        }
      },
      error: (error) => {
        if (error) {
          // Redirect to dashboard if user not found
          alert("L'utilisateur n'existe pas !!")
          this.router.navigate(['/dashboard/user/list']);
        } else {
          // Handle other errors
          console.error('Error retrieving user:', error);
        }
      },
    });
  }
}
