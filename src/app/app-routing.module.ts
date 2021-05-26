import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarDisplayComponent } from './calendar-display/calendar-display.component';
import { CalendarSelComponent } from './calendar-sel/calendar-sel.component';

const routes: Routes = [
  { path: 'adjust', component: CalendarDisplayComponent},
  { path: 'select', component: CalendarSelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
