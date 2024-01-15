/*import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
} from "ng-apexcharts";
import { CategoryService } from '../../services/category.service';
import { Observable, forkJoin, map, merge, of } from 'rxjs';
import ApexCharts from 'apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
};

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  

  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions!: ChartOptions;

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
  chartInstance: any;
  dailyCounts= [12, 21, 34]

  constructor(
    private userService: UserService,
    private shopService: ShopService,
    private serService: ServiceService,
    private categoryService: CategoryService,
    private subscriptionService: SubscriptionService,
    private countryService: CountryService,
    private promotionService: PromotionService){}

  ngAfterViewInit() {
    this.currentUser()
    this.fetchAccounts()
    this.fetchShops()
    this.fetchServices()
    this.renderChart(); // Render chart on init
  }
  
  private renderChart(): void {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 100)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    console.log(this.formatDateForLabel(startDate), this.formatDateForLabel(endDate))

    // Use forkJoin for parallel user count retrieval for daily intervals
    const intervalMap = this.getDailyIntervals(startDate, endDate);
    const userCountRequests = intervalMap.map(
      interval =>
      this.userService.getUsersCreatedBetween(this.formatDateForLabel(interval[0]), this.formatDateForLabel(interval[1]))
        .pipe(
          map(users => users.length) // Emit count directly
        )
    )

    //console.log("les intervals de date: =>",intervalMap)

    forkJoin(userCountRequests)
      .subscribe(dailyCounts => {
        const labels = this.getDailyLabels(startDate, endDate);
        console.log("user growth numbers =>", dailyCounts)

        ;
      });
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

  // Convert timestamp to desired format for x-axis label
  private getAxisLabel(timestamp: Date): string {
    // Adapt this based on your desired format (e.g., date string, week number, month name)
    return timestamp.toLocaleDateString('en-US', { timeZone: 'UTC' })
  }

  private getDailyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
  
    for (let currentEndDate = startDate; currentEndDate < endDate; currentEndDate.setDate(currentEndDate.getDate() + 1)) {
      const nextStartDate = new Date(currentEndDate.getFullYear(), currentEndDate.getMonth(), currentEndDate.getDate());
      intervals.push([currentEndDate, nextStartDate]);
    }
  
    return intervals;
  }

  /*private getDailyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
  
    for (let currentEndDate = startDate; currentEndDate <= endDate; currentEndDate.setDate(currentEndDate.getDate() + 1)) {
      // Ensure nextStartDate is the same date as currentEndDate (not a new Date object)
      const nextStartDate = currentEndDate;
      intervals.push([currentEndDate, nextStartDate]);
    }
  
    return intervals;
  }*/

  /*private getDailyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
    let currentEndDate = startDate;
    let i = 1; // Interval length in days
  
    while (currentEndDate <= endDate) { // Include endDate itself
      const nextStartDate = new Date(currentEndDate.getFullYear(), currentEndDate.getMonth(), currentEndDate.getDate() + i);
      intervals.push([currentEndDate, nextStartDate]);
      currentEndDate = nextStartDate;
    }
  
    return intervals;
  }*/

  /*private getDailyLabels(startDate: Date, endDate: Date): string[] {
    const labels = [];
    for (let date = startDate; date.getTime() < endDate.getTime(); date.setDate(date.getDate())) {
      labels.push(this.getAxisLabel(date));
    }
    return labels;
  }

  private getWeeklyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 7)) {
      intervals.push([date, new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7)]);
    }
    return intervals;
  }

  private getWeeklyLabels(startDate: Date, endDate: Date): string[] {
    const labels = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 7)) {
      labels.push(this.getAxisLabel(date));
    }
    return labels;
  }

  private getMonthlyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
    for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
      intervals.push([date, new Date(date.getFullYear(), date.getMonth() + 1, 1)]);
    }
    return intervals;
  }

  private getMonthlyLabels(startDate: Date, endDate: Date): string[] {
    const labels = [];
    for (let date = startDate; date <= endDate; date.setMonth(date.getMonth() + 1)) {
      labels.push(this.getAxisLabel(date));
    }
    return labels;
  }

  private getYearlyIntervals(startDate: Date, endDate: Date): Date[][] {
    const intervals = [];
    for (let date = startDate; date <= endDate; date.setFullYear(date.getFullYear() + 1)) {
      intervals.push([date, new Date(date.getFullYear() + 1, 0, 1)]);
    }
    return intervals;
  }

  private getYearlyLabels(startDate: Date, endDate: Date): string[] {
    const labels = [];
    for (let date = startDate; date <= endDate; date.setFullYear(date.getFullYear() + 1)) {
      labels.push(this.getAxisLabel(date));
    }
    return labels;
  }

  getDailyGrowthData(startDate: Date, endDate: Date): Observable<any> {
    const intervals = this.getDailyIntervals(startDate, endDate);
  
    return merge(
      ...intervals.map(interval =>
        this.userService.getUsersCreatedBetween(this.formatDateForLabel(interval[0]), this.formatDateForLabel(interval[1]))
          .pipe(
            map(users => users.length) // Emit count directly
          )
      )
    );
  }

  getWeeklyGrowthData(startDate: Date, endDate: Date): Observable<any> {
    const intervals = this.getWeeklyIntervals(startDate, endDate);

    return merge(
      ...intervals.map(interval =>
        this.userService.getUsersCreatedBetween(this.formatDateForLabel(interval[0]), this.formatDateForLabel(interval[1]))
          .pipe(
            map(users => users.length) // Emit count directly
          )
      )
    );
  }

  getMonthlyGrowthData(startDate: Date, endDate: Date): Observable<any> {
    const intervals = this.getMonthlyIntervals(startDate, endDate);

    return merge(
      ...intervals.map(interval =>
        this.userService.getUsersCreatedBetween(this.formatDateForLabel(interval[0]), this.formatDateForLabel(interval[1]))
          .pipe(
            map(users => users.length) // Emit count directly
          )
      )
    );
  }

  getYearlyGrowthData(startDate: Date, endDate: Date): Observable<any> {
    const intervals = this.getYearlyIntervals(startDate, endDate);

    return merge(
      ...intervals.map(interval =>
        this.userService.getUsersCreatedBetween(this.formatDateForLabel(interval[0]), this.formatDateForLabel(interval[1]))
          .pipe(
            map(users => users.length) // Emit count directly
          )
      )
    );
  }

  private formatDateForLabel(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}*/

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
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('countAnimation', [
      state('inactive', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':increment', [
        animate('200ms ease-in') // Adjust duration as needed
      ])
    ])
  ]
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

  countAnimationState = 'inactive'; // Initial state

  incrementCount() {
    this.countServices++;
    this.countAnimationState = 'increment'; // Trigger animation
    setTimeout(() => this.countAnimationState = 'inactive', 200); // Reset after animation
  }

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