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
import { RoomBookingComponent } from './room-booking/room-booking.component';
import { RoomFormComponent } from './room-booking/room-form/room-form.component';
import { FormButtonsComponent } from './room-booking/room-form/form-buttons/form-buttons.component';
import { AddRoomComponent } from './room-booking/add-room/add-room.component';
import { EditRoomComponent } from './room-booking/edit-room/edit-room.component';
import { DeleteRoomComponent } from './room-booking/delete-room/delete-room.component';
import { ViewRoomComponent } from './room-booking/view-room/view-room.component';
import { RoomListComponent } from './room-booking/room-list/room-list.component';
import { DictionaryListComponent } from './dictionaries/dictionary-list/dictionary-list.component';
import { ViewDictionaryComponent } from './dictionaries/view-dictionary/view-dictionary.component';




@NgModule({
  declarations: [
    AppComponent,
    ApptBookingComponent,
    MenuComponent,
    FooterComponent,
    ApptBookingEntityComponent,
    ListApptBookingEntityComponent,
    ApptBookingAdminComponent,
    RoomBookingComponent,
    RoomFormComponent,
    FormButtonsComponent,
    AddRoomComponent,
    EditRoomComponent,
    DeleteRoomComponent,
    ViewRoomComponent,
    RoomListComponent,
    DictionaryListComponent,
    ViewDictionaryComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
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
    NgbModule
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
