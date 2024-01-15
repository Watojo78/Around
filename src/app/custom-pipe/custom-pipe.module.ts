import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date.pipe';
import { SortAndPaginatePipe } from './sort-and-paginate.pipe';
import { FormatOrderByPipe } from './format-order-by.pipe';
import { FilterByRolePipe } from './filter-by-role.pipe';
import { OrderByPipe } from './order-by.pipe';
import { ActiveCountPipe } from './active-count.pipe';
import { ProfileUserListPipe } from './profile-user-list.pipe';
import { ProfileUserNotificationPipe } from './profile-user-notification.pipe';
import { FormatOpenHourDayPipe } from './format-open-hour-day.pipe';
import { FormatRolePipe } from './format-role.pipe';
import { FormattedCountPipe } from './formatted-count.pipe';



@NgModule({
  declarations: [
    FormatDatePipe,
    SortAndPaginatePipe,
    FormatOrderByPipe,
    FilterByRolePipe,
    OrderByPipe,
    ActiveCountPipe,
    ProfileUserListPipe,
    ProfileUserNotificationPipe,
    FormatOpenHourDayPipe,
    FormatRolePipe,
    FormattedCountPipe
  ],
  exports: [
    FormatDatePipe,
    SortAndPaginatePipe,
    FormatOrderByPipe,
    FilterByRolePipe,
    OrderByPipe,
    ActiveCountPipe,
    ProfileUserListPipe,
    ProfileUserNotificationPipe,
    FormatOpenHourDayPipe,
    FormatRolePipe,
    FormattedCountPipe
  ]
})
export class CustomPipeModule { }
