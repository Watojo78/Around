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

  countUsers!: number;
  countShops!: number;
  countRoles!: number;
  countServices!: number;
  lastName!: string;
  adminsLength = 0;
  partnersLength = 0;
  managersLength = 0;
  customersLength = 0;
  userSeries = [49, 70, 89, 55]; 

  constructor(
    private roleService: RoleService,
    private userService: UserService,
    private shopService: ShopService,
    private serService: ServiceService,
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
    this.fetchRoles()
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

  private fetchAccounts(){
    this.userService.getAllUsers()
    .subscribe({
      next: (loadedUsers) => {
        this.countUsers = loadedUsers.length
      },
      error: (err) => {
        console.log("there was an error while retreiving numbers of users", err)
      },
    });
  }

  private fetchShops(){
    this.shopService.getAllShops()
    .subscribe({
      next: (shops) => {
        this.countShops = shops.length
      },
      error: (err) => {
        console.log("there was an error while retreiving numbers of users", err)
      },
    });
  }

  private fetchRoles(){
    this.roleService.getAllRoles()
    .subscribe({
      next: (loadedRoles) => {
        this.countRoles = loadedRoles.length
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
        this.countServices = loadedServices.length
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
