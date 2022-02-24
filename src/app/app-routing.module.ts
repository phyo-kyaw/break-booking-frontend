import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApptBookingAdminComponent } from './appt-booking-admin/appt-booking-admin.component';
import { ApptBookingEntityComponent } from './appt-booking-entity/appt-booking-entity.component';
import { ApptBookingComponent } from './appt-booking/appt-booking.component';
import { AuthGuard } from './appt-booking-utils/app.guard';
import { ListApptBookingEntityComponent } from './list-appt-booking-entity/list-appt-booking-entity.component';
import { ApptBookingEventComponent } from './appt-booking-event/appt-booking-event.component';
import { AdminRoomListComponent } from './rooms/admin/admin-room-list/admin-room-list.component';
import { AddRoomComponent } from './rooms/admin/add-room/add-room.component';
import { EditRoomComponent } from './rooms/admin/edit-room/edit-room.component';
import { ViewRoomComponent } from './rooms/view-room/view-room.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { DictionaryListComponent } from './dictionaries/dictionary-list/dictionary-list.component';
import { ViewDictionaryComponent } from './dictionaries/view-dictionary/view-dictionary.component';
import { RoomPaymentComponent } from './rooms/book-room/room-payment/room-payment.component';
import { PaymentSuccessComponent } from './rooms/book-room/payment-success/payment-success.component';
import { BookRoomFormComponent } from './rooms/book-room/book-room-form/book-room-form.component';

const routes: Routes = [
  //{ path: 'select', component: CalendarSelComponent },
  {
    path: 'entity',
    component: ApptBookingEntityComponent,
    canActivate: [AuthGuard],
    data: { roles: ['booking-admin'] }
  },
  {
    path: 'entity/:gid',
    component: ApptBookingEntityComponent,
    canActivate: [AuthGuard],
    data: { roles: ['booking-admin'] }
  },
  { path: 'book', component: ListApptBookingEntityComponent },
  { path: 'list', component: ListApptBookingEntityComponent },
  { path: 'select/:gid', component: ApptBookingComponent },
  { path: 'admin', component: ApptBookingAdminComponent },
  { path: 'event', component: ApptBookingEventComponent },
  {
    path: 'rooms/all',
    component:
      AdminRoomListComponent /*, canActivate: [AuthGuard] , data: { roles: ['room-provider'] } */
  },
  {
    path: 'rooms/create',
    component:
      AddRoomComponent /*, canActivate: [AuthGuard] , data: { roles: ['room-provider'] } */
  },
  {
    path: 'rooms/edit/:id',
    component:
      EditRoomComponent /*,canActivate: [AuthGuard] , data: { roles: ['room-provider'] }  */
  },
  { path: 'rooms/view/:id', component: ViewRoomComponent },
  { path: 'rooms', component: RoomListComponent },
  {
    path: 'dictionaries',
    component:
      DictionaryListComponent /*,canActivate: [AuthGuard] , data: { roles: ['room-provider'] }  */
  },
  {
    path: 'dictionaries/view/:id',
    component:
      ViewDictionaryComponent /*,canActivate: [AuthGuard] , data: { roles: ['room-provider'] }  */
  },
  {
    path: 'rooms/book/:id',
    component: BookRoomFormComponent
  },
  {
    path: 'rooms/payment/:id',
    component: RoomPaymentComponent
  },
  {
    path: 'rooms/payment/success/:bookingId',
    component: PaymentSuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
