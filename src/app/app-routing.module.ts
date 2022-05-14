import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApptBookingAdminComponent } from './service-booking/appt-booking-admin/appt-booking-admin.component';
import { ApptBookingEntityComponent } from './service-booking/appt-booking-entity/appt-booking-entity.component';
import { ApptBookingComponent } from './service-booking/appt-booking/appt-booking.component';
import { AuthGuard } from './appt-booking-utils/app.guard';
import { ListApptBookingEntityComponent } from './service-booking/list-appt-booking-entity/list-appt-booking-entity.component';
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
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';
import { CalenderComponent } from './events/calender/calender.component';
import { BookEventFormComponent } from './events/book-event/book-event-form/book-event-form.component';
import { EventFormComponent } from './events/admin/event-form/event-form.component';
import { PaymentComponent } from './events/payment/payment.component';
import { SuccessComponent } from './events/success/success.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
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
    data: { roles: ['booking-admin', 'manage-account'] }
  },
  { path: 'book', component: ListApptBookingEntityComponent },
  // { path: 'list', component: ListApptBookingEntityComponent },
  {
    path: 'select/:gid',
    component: ApptBookingComponent,
    canActivate: [AuthGuard],
    data: { roles: ['booking-admin'] }
  },
  { path: 'appt/all', component: ApptBookingAdminComponent },
  {
    path: 'booking/payment/:id',
    component: BookingPaymentComponent
  },
  { path: 'admin/event', component: EventFormComponent },
  { path: 'event', component: CalenderComponent },
  {
    path: 'rooms/all',
    component:
      AdminRoomListComponent /*, canActivate: [AuthGuard] , data: { roles: ['booking-admin'] } */
  },
  {
    path: 'rooms/create',
    component:
      AddRoomComponent /*, canActivate: [AuthGuard] , data: { roles: ['booking-admin'] } */
  },
  {
    path: 'rooms/edit/:id',
    component:
      EditRoomComponent /*,canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }  */
  },
  {
    path: 'rooms/view/:id',
    component: ViewRoomComponent
    // canActivate: [AuthGuard],
    // data: { roles: ['booking-admin'] }
  },
  { path: 'rooms', component: RoomListComponent },
  {
    path: 'event/all',
    component:
      CalenderComponent /*, canActivate: [AuthGuard] , data: { roles: ['booking-admin'] } */
  },
  {
    path: 'event/booking/:id',
    component: BookEventFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['booking-admin'] }
  },
  {
    path: 'event/payment/:id',
    component:
      PaymentComponent /*, canActivate: [AuthGuard] , data: { roles: ['booking-admin'] } */
  },
  {
    path: 'event/booking/success/:id',
    component:
      SuccessComponent /*, canActivate: [AuthGuard] , data: { roles: ['booking-admin'] } */
  },
  {
    path: 'dictionaries',
    component:
      DictionaryListComponent /*,canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }  */
  },
  {
    path: 'dictionaries/view/:id',
    component:
      ViewDictionaryComponent /*,canActivate: [AuthGuard] , data: { roles: ['booking-admin'] }  */
  },
  {
    path: 'rooms/book/:id',
    component: BookRoomFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['booking-admin'] }
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
