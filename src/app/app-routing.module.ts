import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingAdminComponent } from './booking-admin/booking-admin.component';
import { BookingEntityComponent } from './booking-entity/booking-entity.component';
import { CalendarDisplayComponent } from './calendar-display/calendar-display.component';
import { CalendarSelComponent } from './calendar-sel/calendar-sel.component';
import { AuthGuard } from './demo-utils/app.guard';
import { ListBookingEntitiesComponent } from './list-booking-entities/list-booking-entities.component';

const routes: Routes = [
  { path: 'adjust', component: CalendarDisplayComponent},
  //{ path: 'select', component: CalendarSelComponent },
  { path: 'entity', component: BookingEntityComponent , canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }},
  { path: 'entity/:gid', component: BookingEntityComponent , canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }},
  { path: 'book', component: ListBookingEntitiesComponent },
  { path: 'list', component: ListBookingEntitiesComponent },
  { path: 'select/:gid', component: CalendarSelComponent },
  { path: 'admin', component: BookingAdminComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
