import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

import {
  AuthServiceConfig,
  SocialLoginModule,
  GoogleLoginProvider,
} from 'angular-6-social-login'

//import { environment } from '../environments/environment.prod';
import { environment } from '../environments/environment';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('359433450921-rlo86s4pvjah2s8rti4k4ma2mcpm7f8j.apps.googleusercontent.com')
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarDisplayComponent,
    CalendarSelComponent
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
    SocialLoginModule
  ],
  providers: [
   // {provide: HTTP_INTERCEPTORS, useClass: HttpIntercepterService, multi: true}
   { provide: AuthServiceConfig , useFactory: provideConfig },
   { provide: 'BACKEND_API_URL', useValue: environment.backendApiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
