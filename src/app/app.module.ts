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
import { DemoUtilsModule } from './demo-utils/module';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarDisplayComponent } from './calendar-display/calendar-display.component';
import { CalendarSelComponent } from './calendar-sel/calendar-sel.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { initializeKeycloak } from './demo-utils/app.init';


//import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { BookingEntityComponent } from './booking-entity/booking-entity.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ListBookingEntitiesComponent } from './list-booking-entities/list-booking-entities.component';
import { BookingAdminComponent } from './booking-admin/booking-admin.component';




@NgModule({
  declarations: [
    AppComponent,
    CalendarDisplayComponent,
    CalendarSelComponent,
    MenuComponent,
    FooterComponent,
    BookingEntityComponent,
    ListBookingEntitiesComponent,
    BookingAdminComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    DemoUtilsModule,
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
   { provide: 'BACKEND_API_URL', useValue: environment.backendApiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
