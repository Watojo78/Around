import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdmindashboardComponent } from './admindashboard.component';
import { AnalyticComponent } from './analytic/analytic.component';
import { PaymentStatisticComponent } from './payment-statistic/payment-statistic.component';
import { SettingsComponent } from './settings/settings.component';

const dashboardRoutes: Routes = [
    {
      path: '',
      component: AdmindashboardComponent,
      children: [
          { path: '', component: DashboardComponent },
          { path: 'analytics', component: AnalyticComponent },
          { path: 'payments-stats', component: PaymentStatisticComponent },
          { path: 'settings', component: SettingsComponent },
          { 
            path: 'user', 
            loadChildren: () =>
            import("../features/user/user.module").then(m => m.UserModule)
          },
          { 
            path: 'promotion', 
            loadChildren: () =>
            import("../features/promotion/promotion.module").then(m => m.PromotionModule)
          },
          {
            path: 'country',
            loadChildren: () =>
            import("../features/country/country.module").then(m => m.CountryModule) 
          },
          {
            path: 'region',
            loadChildren: () =>
            import("../features/region/region.module").then(m => m.RegionModule) 
          },
          { 
            path: 'city', 
            loadChildren: () =>
            import("../features/city/city.module").then(m => m.CityModule)
          },
          {
            path: 'neighborhood',
            loadChildren: () =>
            import("../features/neighborhood/neighborhood.module").then(m => m.NeighborhoodModule) 
          },
          { 
            path: 'role', 
            loadChildren: () =>
            import("../features/role/role.module").then(m => m.RoleModule)
          },
          { 
            path: 'service', 
            loadChildren: () =>
            import("../features/service/service.module").then(m => m.ServiceModule)
          },
          { 
            path: 'shop', 
            loadChildren: () =>
            import("../features/shop/shop.module").then(m => m.ShopModule)
          },
          { 
            path: 'subscription', 
            loadChildren: () =>
            import("../features/subscription/subscription.module").then(m => m.SubscriptionModule)
          },
          
        ]
    },

  ];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class AdmindashboardRoutingModule { }
