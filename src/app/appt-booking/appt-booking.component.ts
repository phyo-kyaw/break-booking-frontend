import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import {

  CalendarMonthViewDay,
  CalendarView,
  CalendarEventTitleFormatter,
  CalendarWeekViewBeforeRenderEvent,
  DAYS_OF_WEEK,
  CalendarDateFormatter,
  CalendarEvent,
} from 'angular-calendar';
import {  KeycloakService } from 'keycloak-angular';
import { WeekDay, WeekViewHourSegment, WeekViewHourColumn, EventAction, EventColor } from 'calendar-utils';
import { CalendarHeaderComponent } from '../appt-booking-utils/calendar-header.component';
import { CustomEventTitleFormatter } from '../appt-booking-utils/custom-event-title-formatter.provider';
import { CustomDateFormatter } from '../appt-booking-utils/custom-date-formatter.provider';
import { colors } from '../appt-booking-utils/colors';
//import { BookingEvent } from '../appt-booking-utils/event-b';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import {
  startOfDay,
  endOfDay,
  subDays,
  addMinutes,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  isBefore,
  isSameDay,
  isSameMonth,
  addHours,
  nextDay,
  startOfTomorrow,
  startOfToday,
  startOfHour,
  isAfter,
} from 'date-fns';
import { ApptBookingDataService } from '../service/data/appt-booking-data.service';
import { ApptBookingData } from './event-data';
import { KeycloakProfile } from 'keycloak-js';
import { createElementCssSelector } from '@angular/compiler';
import { ApptBookingEntityDataService } from 'app/service/data/appt-booking-entity-data.service';
import { WorkSession, ApptBookingEntity } from 'app/appt-booking-entity/models';


@Component({
  selector: 'app-appt-booking',
  templateUrl: './appt-booking.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./appt-booking.component.css',],
  // don't do this in your app, its only so the styles get applied globally
  styles: [
    `
      .cal-day-selected,
      .cal-day-selected:hover {
        background-color: deeppink !important;
      }
      .cal-weekends,
      .cal-weekends:hover {
        background-color: darkgrey !important;
      }

      .cal-month-view .cal-day-cell.cal-past,
      .cal-month-view .cal-day-cell.cal-past:hover {
        background-color: lightgrey;
      }

      .cal-month-view .cal-day-cell.cal-today .cal-day-number {
        font-size: 1.2em ;
      }

      .cal-month-view .cal-day-number {
        font-size: 1.2em;
        font-weight: 900;
        opacity: 0.7;
        margin-top: 10px;
        margin-right: 1%;
        float: right;
        margin-bottom: 10px;
      }

      .cal-month-view .cal-day-cell {
        min-height: 60px;
      }
      .cal-month-view .cal-day-cell.cal-today {
        background-color: #e8fde7;
      }
      .cal-month-view .cal-cell-top {
        min-height: 45px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .cal-month-view .cal-cell-foot {
        min-height: 15px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .cal-month-view .cal-day-badge {
        margin-top: 1%;
        margin-left: 1%;
        display: inline-block;
        min-width: 10px;
        padding: 3px 7px;
        background-color: green;
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        border-radius: 2px;
      }
    `,
  ],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter,
    },
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ApptBookingComponent  implements OnInit, OnDestroy {

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  weekStartsOn: number = DAYS_OF_WEEK.SUNDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  hourColumns: WeekViewHourColumn[];

  apptBookingEntity: ApptBookingEntity;


  dayStartHour=9
  dayStartMinute=0
  dayEndHour=18
  dayEndMinute=0

  hourSegmentHeight: number = 10;

  hourSegments: number = 5;

  gid: string;

  amStartHour: number;
  amStartMinute: number;
  amStart: number;

  amEndHour: number;
  amEndMinute: number;
  amEnd: number;

  pmStartHour: number;
  pmStartMinute: number;
  pmStart: number;

  pmEndHour: number;
  pmEndMinute: number;
  pmEnd: number;

  sessionTaken : number;
  intervalBreak: number;

  minAdvanceBookingUnit: string ;
  minAdvanceBooking: number;
  maxAdvanceBookingInDay: number;

  bookAllowFromHr: number = 0;
  bookAllowFromMin: number = 0;
  bookAllowFrom: number = 0;


  events: ApptBookingData[] = []; //events angular calendar variable
  apptBookingDataRef: ApptBookingData[] = [];

  //eventBook: BookingEvent;

  //eventBs: BookingEvent[];

  //eveA: CalendarEvent[] = [];

  //workingDays: number[] = [];

  workingWeekDays: WorkSession[] = [];

  daysInWeek = 7;

  viewDateDec: number;

  isLoggedIn: Boolean = false;

  randomNumberChangeDetect: number = 0;



  breaks: any[] = [{ name: "lunch break", time : { hour:1, minute:0 }, duration : { hour:1, minute:0 } }]

  public userProfile: KeycloakProfile | null = null;
  userRoles: string[] = [];
  isServiceProvider = false;
  isBookerDetailsOn = false;

  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private bookingService: ApptBookingDataService,
    private bookingEntityDataService: ApptBookingEntityDataService,
    protected readonly keycloakService: KeycloakService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    console.log("start1 " + this.userProfile);
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.userRoles = await this.keycloakService.getUserRoles();
      if (this.userRoles.includes('provider')) {
        this.isServiceProvider = true;
      }

      console.log(this.userProfile);
      console.log(this.userRoles);
    }
    this.gid = this.route.snapshot.paramMap.get('gid');
      //"818ad340-f62b-f309-6553-be72bf0ec302";
      console.log(this.gid);
    this.bookingEntityDataService.getBookingEntity(this.gid).subscribe(
      response => {

        this.apptBookingEntity = response as ApptBookingEntity;

        this.sessionTaken = this.apptBookingEntity.sessionM.hour * 60 + this.apptBookingEntity.sessionM.minute;
        this.intervalBreak = this.apptBookingEntity.intervalBreakM.hour * 60 + this.apptBookingEntity.intervalBreakM.minute;

        this.hourSegments = 60 / Math.floor(this.sessionTaken / 3 );

        this.amStartHour = this.apptBookingEntity.amStartM.hour;
        this.amStartMinute = this.apptBookingEntity.amStartM.minute;
        this.amStart = this.apptBookingEntity.amStartM.hour * 60 + this.apptBookingEntity.amStartM.minute;

        this.amEndHour = this.apptBookingEntity.amEndM.hour;
        this.amEndMinute = this.apptBookingEntity.amEndM.minute;
        this.amEnd = this.apptBookingEntity.amEndM.hour * 60 + this.apptBookingEntity.amEndM.minute;

        this.pmStartHour = this.apptBookingEntity.pmStartM.hour;
        this.pmStartMinute = this.apptBookingEntity.pmStartM.minute;
        this.pmStart = this.apptBookingEntity.pmStartM.hour * 60 + this.apptBookingEntity.pmStartM.minute;

        this.pmEndHour = this.apptBookingEntity.pmEndM.hour;
        this.pmEndMinute = this.apptBookingEntity.pmEndM.minute;
        this.pmEnd = this.apptBookingEntity.pmEndM.hour * 60 + this.apptBookingEntity.pmEndM.minute;

        this.minAdvanceBookingUnit = this.apptBookingEntity.minAdvanceBookingUnit;
        this.minAdvanceBooking = this.apptBookingEntity.minAdvanceBooking;
        this.maxAdvanceBookingInDay = this.apptBookingEntity.maxAdvanceBookingInDay;
        //this.workingDays = this.bookingEntity.workingDays;
        this.workingWeekDays = this.apptBookingEntity.workingDays;


        console.log(this.apptBookingEntity.minAdvanceBookingUnit);
        this.prepareFrontEndData();
        this.updateWithBackEndData();
      },
      error => {
        console.log(error);
      }
    );


    const CALENDAR_RESPONSIVE = {
      small: {
        breakpoint: '(max-width: 576px)',
        daysInWeek: 3,
        viewDateDec: 1,
      },
      medium: {
        breakpoint: '(max-width: 768px)',
        daysInWeek: 5,
        viewDateDec: 2,
      },
      large: {
        breakpoint: '(max-width: 960px)',
        daysInWeek: 7,
        viewDateDec: 3,
      },
    };

    this.breakpointObserver
      .observe(
        Object.values(CALENDAR_RESPONSIVE).map(({ breakpoint }) => breakpoint)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: BreakpointState) => {
        const foundBreakpoint = Object.values(CALENDAR_RESPONSIVE).find(
          ({ breakpoint }) => !!state.breakpoints[breakpoint]
        );
        if (foundBreakpoint) {
          this.daysInWeek = foundBreakpoint.daysInWeek;
          this.viewDateDec = foundBreakpoint.viewDateDec;
        } else {
          this.daysInWeek = 7;
          this.viewDateDec = 3;
        }
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.destroy$.next();
  }


  updateWithBackEndData() {
    console.log("start");
    console.log(this.gid);
    this.bookingService.getBookingsByGid(this.gid).subscribe(
      response => {
        console.log(response);
        this.apptBookingDataRef = response;
        console.log(this.apptBookingDataRef);
        console.log(this.events);
        if (this.apptBookingDataRef.length > 0) {
          for (let event of this.apptBookingDataRef) {
            this.events = this.events.map((iEvent) => {

              if (iEvent.start.getTime() === Date.parse(event.start + ".000Z") &&
              iEvent.end.getTime() === Date.parse(event.end + ".000Z") ) {
                console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(event.start + ".000Z"));

                iEvent.color = colors.red;
                console.log(event.apptBookerEmail);
                console.log(this.userProfile);
                if ((event.apptBookerEmail != null || "") && (this.userProfile != null || "") ) {
                  if (( event.apptBookerEmail === this.userProfile.email )) {
                    iEvent.color = colors.yellow; //event.color;
                    console.log(event.apptBookerEmail);
                  }
                }

                iEvent.id = event.id;

                iEvent.meta.incrementsBadgeTotal = false;
                if (event.meta != null) {
                  if (event.meta.email != null) {
                    iEvent.meta.email = event.meta.email;
                  }
                }
                if (event.apptBookerEmail != null) {
                    iEvent.apptBookerEmail = event.apptBookerEmail;
                }
                if (event.apptBookerName != null) {
                  iEvent.apptBookerName = event.apptBookerName;
                  iEvent.title = event.apptBookerName;
              }

                iEvent.apptBookingEntityGid = this.apptBookingEntity.gid;
                iEvent.apptBookingEntityName = this.apptBookingEntity.title_1;
              }
              return iEvent;
            });
          }
        }
        this.randomNumberChangeDetect = Math.random();
        this.cd.markForCheck();
        console.log("backend update " + this.randomNumberChangeDetect);

      },
      error => {
        console.log(error);
      }
    );
  }

  prepareFrontEndData() {
    console.log('prepareFrontEndData');
    let start = startOfDay(new Date());
    if (this.minAdvanceBookingUnit == "day") {
      start = addDays(start, this.minAdvanceBooking);
      this.bookAllowFrom = 0;
    }

    for (let i = start;
        isBefore(i, endOfMonth(addMonths(new Date(), 1)));
      i = addDays(i, 1)) {

      console.log('allow from ', startOfDay(i).getTime() === startOfToday().getTime() && this.minAdvanceBookingUnit == "hour");

      if (startOfDay(i).getTime() === startOfToday().getTime() && this.minAdvanceBookingUnit == "hour") {
        let bookAllowFromHour: number = startOfHour(new Date()).getHours() + this.minAdvanceBooking;
        let bookAllowFromMinute: number = startOfHour(new Date()).getMinutes();
        this.bookAllowFrom = bookAllowFromHour * 60 + bookAllowFromMinute;
      }
      else {
        this.bookAllowFrom = 0
      }


      if (this.workingWeekDays.filter(s => s.day === i.getDay()).length > 0) {
        if (this.workingWeekDays.filter(s => s.day === i.getDay() &&
          s.session == "AM").length > 0) {
          for (let j = this.amStart > this.bookAllowFrom ? this.amStart : this.bookAllowFrom;
            j + this.sessionTaken <= this.amEnd;
            j = j + this.sessionTaken + this.intervalBreak) {
            this.events.push({
              title: '',
              start: addMinutes(i, j),
              end: addMinutes(i, j + this.sessionTaken),
              color: colors.green,
              apptBookingEntityGid: this.apptBookingEntity.gid,
              meta: {
                incrementsBadgeTotal: true,
              },
            });
          }
        }
        if (this.workingWeekDays.filter(s => s.day === i.getDay() &&
          s.session == "PM").length > 0) {
          for (let j = this.pmStart > this.bookAllowFrom ? this.pmStart : this.bookAllowFrom;
            j + this.sessionTaken <= this.pmEnd;
            j = j + this.sessionTaken + this.intervalBreak) {

            this.events.push({
              title: '',
              start: addMinutes(i, j),
              end: addMinutes(i, j + this.sessionTaken),
              color: colors.green,
              apptBookingEntityGid: this.apptBookingEntity.gid,
              meta: {
                incrementsBadgeTotal: true,
              },
            });
          }
        }
    }
    }
    console.log('this.apptBookingData');
    console.log(this.events);
  }


  changeDay(date: Date) {
    if ( !isBefore(  date, startOfToday()) ){
      this.viewDate = date;
      //console.log(this.viewDate);
      if (this.viewDate.getDay() > this.viewDateDec) {
        this.viewDate.setDate(this.viewDate.getDate() - this.viewDateDec);
      }
      //console.log(this.viewDate);
      //console.log(this.viewDateDec);
      this.view = CalendarView.Week;
    }
  }

  eventClicked({ event }: { event: ApptBookingData }): void { //{ event: CalendarEvent }): void {
    //console.log("1 " + this.isLoggedIn);
    //this.keycloakService.isLoggedIn().then(status => { this.isLoggedIn = status; console.log("2 " +this.isLoggedIn); });
    console.log("3 " + this.isLoggedIn);

    var loginPromise =  this.keycloakService.isLoggedIn();
    loginPromise.then((value) => { //keycloak log in
    //let value = true; //else keycloak log in
      if (value) {
        ///console.log('Event clicked ' + value);
        //console.log(event.color);
        if (JSON.stringify(event.color) === JSON.stringify(colors.green)) {
          if (confirm("Confirm booking?")) {
            var eventCopy = event;
            eventCopy.color = colors.red;
            eventCopy.apptBookerEmail = this.userProfile.email;
            eventCopy.apptBookerName = this.userProfile.firstName + " " + this.userProfile.lastName;
            eventCopy.apptBookingEntityName = this.apptBookingEntity.title_1;
            eventCopy.apptBookingEntityGid = this.apptBookingEntity.gid;

            console.log('create eventCopy ' + eventCopy);

            this.bookingService.createBooking(eventCopy).subscribe(
              response => {
                this.events = this.events.map((iEvent) => {
                  //console.log(iEvent);
                  if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z") &&
                  iEvent.end.getTime() === Date.parse(eventCopy.end + ".000Z")) {
                    //console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                    iEvent.color = eventCopy.color;
                    iEvent.meta.incrementsBadgeTotal = false;

                    iEvent.apptBookerEmail = eventCopy.apptBookerEmail;
                    iEvent.apptBookerEmail = eventCopy.apptBookerName;
                    iEvent.apptBookingEntityGid = eventCopy.apptBookingEntityName;
                    iEvent.apptBookingEntityName = eventCopy.apptBookingEntityGid;
                    console.log('create iEvent ' + iEvent);

                  }
                  //console.log('iEvent ' );

                  return iEvent;
                });
                console.log('create event clicked!');
                console.log(response);
                this.updateWithBackEndData();
              },
              error => {
                console.log(error);
              }
            );
            console.log('Final create event clicked', event);
          }
          return value;  //keycloak log in
        }
        else if ( ( JSON.stringify(event.color) === JSON.stringify(colors.red ) ) &&
                  ( event.apptBookerEmail != null || "" ) &&
                  ( event.apptBookerEmail === this.userProfile.email ) ) {
          if (confirm("Cancel booking?")) {
            var eventCopy = event;
            eventCopy.color = colors.green;
            eventCopy.id = event.id;

            console.log('delete eventCopy ' + eventCopy);

            this.bookingService.deleteBooking(event.id).subscribe(
              response => {
                this.events = this.events.map((iEvent) => {
                  if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z") &&
                  iEvent.end.getTime() === Date.parse(eventCopy.end + ".000Z")) {
                    //console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                    iEvent.color = colors.green;
                    iEvent.id = null;
                    iEvent.meta.incrementsBadgeTotal = true;

                    iEvent.apptBookerEmail = null;
                    iEvent.apptBookerName = null;
                    iEvent.apptBookingEntityGid = eventCopy.apptBookingEntityGid;
                    iEvent.apptBookingEntityName = null;
                    console.log('delete iEvent ' + iEvent);

                  }
                  return iEvent;
                });
                console.log('delete event clicked!');
                console.log(response);
                this.updateWithBackEndData();
              },
              error => {
                console.log(error);
              }
            );
            console.log('Final delete event clicked', event);
          }
          return value; //keycloak log in
        }
      }
      else { //keycloak log in
        console.log("4 " + this.isLoggedIn);
        this.keycloakService.login(
          //{redirectUri: "http://localhost:4200/select",}
        );
        return value;
      }
    }).catch( (error) => {
      console.log("4 " + this.isLoggedIn + " " + error);

    });

  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach((day) => {
      day.badgeTotal = day.events.filter(
        (event) => event.meta.incrementsBadgeTotal
      ).length;
      if (day.date.getDay() === 0 || day.date.getDay() === 6) {
        day.cssClass = 'cal-weekends';
      }
      console.log(day.badgeTotal);
    });
    console.log('beforeRender');
  }

  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
  }

  beforeWeekOrDayViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    this.hourColumns = event.hourColumns;
  }

  getEvent(e: any) {
    console.log(e);
    //console.log(id);
    if (e.target.checked) {
      console.log(' checked ');
      if (this.isServiceProvider) {
        this.isBookerDetailsOn = true;
        this.ngOnInit();
      }
    }
    else {
      if (this.isServiceProvider) {
        this.isBookerDetailsOn = false;
        this.ngOnInit();
      }
    }
  }

}
