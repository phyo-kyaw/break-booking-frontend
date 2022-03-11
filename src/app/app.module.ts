import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import FormControl from '@material-ui/core/FormControl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
//import { SchedulerModule } from 'angular-calendar-scheduler';
import { ApptBookingUtilsModule } from './appt-booking-utils/module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApptBookingComponent } from './service-booking/appt-booking/appt-booking.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

import { initializeKeycloak } from './appt-booking-utils/app.init';

//import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ApptBookingEntityComponent } from './service-booking/appt-booking-entity/appt-booking-entity.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListApptBookingEntityComponent } from './service-booking/list-appt-booking-entity/list-appt-booking-entity.component';
import { ApptBookingAdminComponent } from './service-booking/appt-booking-admin/appt-booking-admin.component';
import { AdminRoomListComponent } from './rooms/admin/admin-room-list/admin-room-list.component';
import { RoomFormComponent } from './rooms/admin/room-form/room-form.component';
import { FormButtonsComponent } from './rooms/admin/room-form/form-buttons/form-buttons.component';
import { AddRoomComponent } from './rooms/admin/add-room/add-room.component';
import { EditRoomComponent } from './rooms/admin/edit-room/edit-room.component';
import { DeleteRoomComponent } from './rooms/admin/delete-room/delete-room.component';
import { ViewRoomComponent } from './rooms/view-room/view-room.component';
import { RoomListComponent } from './rooms/room-list/room-list.component';
import { DictionaryListComponent } from './dictionaries/dictionary-list/dictionary-list.component';
import { ViewDictionaryComponent } from './dictionaries/view-dictionary/view-dictionary.component';
import { RoomBookCalendarComponent } from './rooms/book-room/calendar/calendar.component';
import { RoomPaymentComponent } from './rooms/book-room/room-payment/room-payment.component';
import { LoadingScreenComponent } from './misc/loading-screen/loading-screen.component';
import { PaymentSuccessComponent } from './rooms/book-room/payment-success/payment-success.component';
import { BookRoomFormComponent } from './rooms/book-room/book-room-form/book-room-form.component';
import { MatIconModule } from '@angular/material/icon';
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';
import { CalenderComponent } from './events/calender/calender.component';
import { EventFormComponent } from './events/admin/event-form/event-form.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { BookEventFormComponent } from './events/book-event/book-event-form/book-event-form.component';
import { FlatpickrModule } from 'angularx-flatpickr';

@NgModule({
  declarations: [
    AppComponent,
    ApptBookingComponent,
    MenuComponent,
    FooterComponent,
    ApptBookingEntityComponent,
    ListApptBookingEntityComponent,
    ApptBookingAdminComponent,
    AdminRoomListComponent,
    RoomFormComponent,
    FormButtonsComponent,
    AddRoomComponent,
    EditRoomComponent,
    DeleteRoomComponent,
    ViewRoomComponent,
    RoomListComponent,
    DictionaryListComponent,
    ViewDictionaryComponent,
    RoomBookCalendarComponent,
    RoomPaymentComponent,
    LoadingScreenComponent,
    PaymentSuccessComponent,
    BookRoomFormComponent,
    BookingPaymentComponent,
    CalenderComponent,
    EventFormComponent,
    EventDetailComponent,
    BookEventFormComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    ApptBookingUtilsModule,
    //SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    NgbModule,
    MatIconModule
  ],
  providers: [
    // {provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true}
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    { provide: 'BACKEND_API_URL', useValue: environment.homeUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
