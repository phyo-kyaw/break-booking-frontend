import '../../node_modules/flatpickr/dist/flatpickr.min.css';
// import '../../node_modules/flatpickr/dist/flatpickr.css';
import "../../node_modules/angular-calendar/css/angular-calendar.css";

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import  FormControl  from '@material-ui/core/FormControl';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter  } from 'angular-calendar';
//import { SchedulerModule } from 'angular-calendar-scheduler';
import { ApptBookingUtilsModule } from './appt-booking-utils/module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApptBookingComponent } from './appt-booking/appt-booking.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { initializeKeycloak } from './appt-booking-utils/app.init';


//import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { ApptBookingEntityComponent } from './appt-booking-entity/appt-booking-entity.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListApptBookingEntityComponent } from './list-appt-booking-entity/list-appt-booking-entity.component';
import { ApptBookingAdminComponent } from './appt-booking-admin/appt-booking-admin.component';
import { ApptBookingEventComponent } from './appt-booking-event/appt-booking-event.component';
import { ApptBookingAEventComponent } from './appt-booking-event/appt-booking-a-event/appt-booking-a-event.component';

// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
// import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
// import { DemoComponent } from './component';
// import '../../node_modules/flatpickr/dist/flatpickr.css';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    ApptBookingComponent,
    MenuComponent,
    FooterComponent,
    ApptBookingEntityComponent,
    ListApptBookingEntityComponent,
    ApptBookingAdminComponent,
    ApptBookingEventComponent,
    ApptBookingAEventComponent
  ],
  imports: [
    NgbModalModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ApptBookingUtilsModule,
    //SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    NgxMaterialTimepickerModule,
    NgbModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // BrowserAnimationsModule
  ],
  providers: [
   // {provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true}
   {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService],
  },
   { provide: 'BACKEND_API_URL', useValue: environment.homeUrl }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
