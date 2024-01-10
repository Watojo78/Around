import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from '../Shared/shared.module';

import { HttpClientModule} from '@angular/common/http';
import { AdmindashboardComponent } from './admindashboard.component';
import { AdmindashboardRoutingModule } from './admindashboard-routing.module';
import { AdminHeaderComponent } from '../Shared/admin-header/admin-header.component';
import { AdminFooterComponent } from '../Shared/admin-footer/admin-footer.component';
import { SidebarComponent } from '../Shared/sidebar/sidebar.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AnalyticComponent } from './analytic/analytic.component';
import { PaymentStatisticComponent } from './payment-statistic/payment-statistic.component';
import { SettingsComponent } from './settings/settings.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CustomPipeModule } from '../custom-pipe/custom-pipe.module';

@NgModule({
  declarations: [
    AdmindashboardComponent,
    AdminHeaderComponent,
    AdminFooterComponent,
    DashboardComponent,
    SidebarComponent,
    AnalyticComponent,
    PaymentStatisticComponent,
    SettingsComponent,
  ],
  imports: [ 
    AdmindashboardRoutingModule,
    NgApexchartsModule,
    SharedModule,
    CustomPipeModule,
    HttpClientModule,
  ],
  providers: [],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})
export class AdmindashboardModule { }
