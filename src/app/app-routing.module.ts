import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApptBookingAdminComponent } from './appt-booking-admin/appt-booking-admin.component';
import { ApptBookingEntityComponent } from './appt-booking-entity/appt-booking-entity.component';
import { ApptBookingComponent } from './appt-booking/appt-booking.component';
import { AuthGuard } from './appt-booking-utils/app.guard';
import { ListApptBookingEntityComponent } from './list-appt-booking-entity/list-appt-booking-entity.component';
import { ApptBookingEventComponent } from './appt-booking-event/appt-booking-event.component';

const routes: Routes = [
  //{ path: 'select', component: CalendarSelComponent },
  { path: 'entity', component: ApptBookingEntityComponent , canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }},
  { path: 'entity/:gid', component: ApptBookingEntityComponent , canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }},
  { path: 'book', component: ListApptBookingEntityComponent },
  { path: 'list', component: ListApptBookingEntityComponent },
  { path: 'select/:gid', component: ApptBookingComponent },
  { path: 'admin', component: ApptBookingAdminComponent },
  { path: 'event', component: ApptBookingEventComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
