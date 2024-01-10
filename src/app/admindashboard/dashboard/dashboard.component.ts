import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { PromotionService } from '../../services/promotion.service';
import { RoleService } from '../../services/role.service';
import { ServiceService } from '../../services/service.service';
import { ShopService } from '../../services/shop.service';
import { SubscriptionService } from '../../services/subscription.service';
import { UserService } from '../../services/user.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { CategoryService } from '../../services/category.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: ChartOptions;

  users: any;
  shops: any;
  services: any;
  lastEightServices: any;
  countServices!: number;
  lastName!: string;
  adminsLength = 0;
  partnersLength = 0;
  managersLength = 0;
  customersLength = 0;
  catMap!: Map<number, string>;
  userSeries = [49, 70, 89, 55]; 

  constructor(
    private userService: UserService,
    private shopService: ShopService,
    private serService: ServiceService,
    private categoryService: CategoryService,
    private subscriptionService: SubscriptionService,
    private countryService: CountryService,
    private promotionService: PromotionService){
      this.chartOptions = {
        series: [
          {
            name: "series1",
            data: [31, 40, 28, 51, 42, 109, 100]
          },
          {
            name: "series2",
            data: [11, 32, 45, 32, 34, 52, 41]
          }
        ],
        chart: {
          height: 400,
          width: 570,
          type: "area",
          fontFamily: "poppins"
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "smooth"
        },
        xaxis: {
          type: "datetime",
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z"
          ]
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm"
          }
        }
      };
  }

  ngAfterViewInit() {
    this.currentUser()
    this.fetchAccounts()
    this.fetchShops()
    this.fetchServices()
  }

  
  private currentUser(){
    this.userService.getCurrentUser()
    .subscribe({
      next: (currentUser: any) => {
        const token = sessionStorage.getItem('token')
        const decodedToken = this.userService.decodeCurrrentUserToken(token)
        console.log(decodedToken)
        this.lastName = currentUser.lastName;
      },
      error: (err: any) => {
        console.log("there was an error while retreiving your name", err)
      },
    })
  }

  catName(catId: number): string | undefined {
    if (!this.catMap?.has(catId)) {
      return 'Unknown Category';
    }

    return this.catMap.get(catId);
  }

  private fetchAccounts(){
    this.userService.getAllUsers()
    .subscribe({
      next: (loadedUsers) => {
        this.users = loadedUsers
      },
      error: (err) => {
        console.log("there was an error while retreiving numbers of users", err)
      },
    });
  }

  private fetchShops(){
    this.shopService.getAllShops()
    .subscribe({
      next: (shopRes) => {
        this.shops = shopRes;
      },
      error: (err) => {
        console.log("there was an error while retreiving numbers of users", err)
      },
    });
  }

  private fetchServices(){
    this.serService.getAllServices()
    .subscribe({
      next: (loadedServices) => {
        this.services = loadedServices;
        this.countServices = this.services.length;
        this.lastEightServices = this.services.slice(-8);

        this.categoryService.getAllCategories()
        .subscribe({
          next: (loadedCats) => {

            this.catMap = new Map<number, string>();
            loadedCats.forEach((cat: { idCategorie: number; nomCategorie: string; }) => {
              this.catMap.set(cat.idCategorie, cat.nomCategorie);
            });

            // Enrich service objects with cat names
            for (const service of this.services) {
              if (this.catMap.has(service.catId)) {
                service.cat = this.catMap.get(service.catId);
              } else {
                service.cat = 'Unknown category';
              }
            }
          },
          error: (err) => {
            
          },
        })
      },
      error: (err) => {
        console.log("there was an error while retreiving numbers of users", err)
      },
    });
  }
  
  public generateData(baseval: number, count: number, yrange: { max: number; min: number; }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
