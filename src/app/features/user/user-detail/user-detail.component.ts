import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { ServiceService } from '../../../services/service.service';
import { ShopService } from '../../../services/shop.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  user: any;
  id!: number;
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
 
  constructor(
    private router: Router,
    private userService: UserService,
    private shopService: ShopService,
    private serService: ServiceService,
    private catService: CategoryService,
    private route: ActivatedRoute){}

    ngOnInit() {
      this.route.params
        .subscribe((params: Params) => {
          this.id = +params['id'];
          this.userService.getUser(this.id)
            .subscribe({
              next: (user) => {
                this.user = user;
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
        });
    }
}
