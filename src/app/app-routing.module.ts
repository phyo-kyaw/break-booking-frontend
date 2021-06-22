import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingEntityComponent } from './booking-entity/booking-entity.component';
import { CalendarDisplayComponent } from './calendar-display/calendar-display.component';
import { CalendarSelComponent } from './calendar-sel/calendar-sel.component';
import { AuthGuard } from './demo-utils/app.guard';

const routes: Routes = [
  { path: 'adjust', component: CalendarDisplayComponent},
  { path: 'select', component: CalendarSelComponent },
  { path: 'entity', component: BookingEntityComponent } //, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
