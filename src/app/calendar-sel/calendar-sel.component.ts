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
import { CalendarHeaderComponent } from '../demo-utils/calendar-header.component';
import { CustomEventTitleFormatter } from '../demo-utils/custom-event-title-formatter.provider';
import { CustomDateFormatter } from '../demo-utils/custom-date-formatter.provider';
import { colors } from '../demo-utils/colors';
import { BookingEvent } from '../demo-utils/event-b';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UrlSegment } from '@angular/router';
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
import { BookingDataService } from '../service/data/booking-data.service';
import { EventData } from './event-data';
import { KeycloakProfile } from 'keycloak-js';
import { createElementCssSelector } from '@angular/compiler';
import { BookingEntityDataService } from 'app/service/data/booking-entity-data.service';


@Component({
  selector: 'app-calendar-sel',
  templateUrl: './calendar-sel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar-sel.component.css',],
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
export class CalendarSelComponent  implements OnInit, OnDestroy {

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  weekStartsOn: number = DAYS_OF_WEEK.SUNDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  hourColumns: WeekViewHourColumn[];

  hourSegmentHeight: number = 10;

  hourSegments: number = 4;

  dayStartHour: number = 9;
  dayStartMinute: number = 30;
  dayStart = this.dayStartHour * 60 + this.dayStartMinute;

  dayEndHour: number = 17;
  dayEndMinute: number = 30;
  dayEnd = this.dayEndHour * 60 + this.dayEndMinute;

  lunchBreakStartHr: number = 13;
  lunchBreakStartMin: number = 30;
  lunchBreakStart = this.lunchBreakStartHr * 60 + this.lunchBreakStartMin;

  lunchBreakDurationHr: number = 1;
  lunchBreakDurationMin: number = 0;
  lunchBreakEnd = this.lunchBreakStart + this.lunchBreakDurationHr * 60 + this.lunchBreakDurationMin;

  sessionTakenHr: number = 0;
  sessionTakenMin: number = 45;
  sessionTaken = this.sessionTakenHr * 60 + this.sessionTakenMin;
  //LastSessionHour: number = this.dayEndHour - 1;


  events: CalendarEvent[] = [];
  eventDataArry: EventData[] = [];

  eventBook: BookingEvent;

  eventBs: BookingEvent[];

  eveA: CalendarEvent[] = [];

  selectedDays: any = [];

  daysInWeek = 7;

  viewDateDec: number;

  isLoggedIn: Boolean = false;

  randomNumberChangeDetect: number = 0;

  minAdvanceBookingHr = 0;
  minAdvanceBookingDay = 2;
  maxAdvanceBookingDay = 100;

  bookAllowFromHr: number = 0;
  bookAllowFromMin: number = 0;
  bookAllowFrom: number = 0;

  breaks: any[] = [{ name: "lunch break", time : { hour:1, minute:0 }, duration : { hour:1, minute:0 } }]

  public userProfile: KeycloakProfile | null = null;

  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private bookingService: BookingDataService,
    private bookingEntityDataService: BookingEntityDataService,
    protected readonly keycloakService: KeycloakService,
  ) {}

  async ngOnInit() {
    console.log("start1 " + this.userProfile);
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      console.log(this.userProfile);
    }
    let gid = "363ff2e2-28f3-ae54-b3de-010b319ff658";
    this.bookingEntityDataService.getBookingEntity(gid).subscribe(
      response => {
        console.log(response);
        console.log('select');
      },
      error => {
        console.log(error);
      }
    );
    this.prepareFrontEndData();
    this.updateWithBackEndData();

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
    this.bookingService.retrieveAllBookings().subscribe(
      response => {
        console.log(response);
        this.eventDataArry = response;
        console.log(this.eventDataArry);
        console.log(this.events);
        if (this.eventDataArry.length > 0) {
          for (let event of this.eventDataArry) {
            this.events = this.events.map((iEvent) => {
              //console.log(iEvent);
              if (iEvent.start.getTime() === Date.parse(event.start + ".000Z")) {
                console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(event.start + ".000Z"));
                iEvent.color = event.color;
                iEvent.id = event.id;
                iEvent.meta.incrementsBadgeTotal = false;
                if (event.meta != null) {
                  if (event.meta.email != null) {
                    iEvent.meta.email = event.meta.email;
                  }
                }
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
    if (this.minAdvanceBookingDay > 0) {
      start = addDays(start, this.minAdvanceBookingDay);
      this.bookAllowFrom = 0;
    }
 
    for (let i = start;
        isBefore(i, endOfMonth(addMonths(new Date(), 1)));
      i = addDays(i, 1)) {
      
      if (startOfDay(new Date()) === startOfToday() && this.minAdvanceBookingDay == 0) {
        let bookAllowFromHour: number = startOfHour(new Date()).getHours() - this.minAdvanceBookingHr;
        let bookAllowFromMinute: number = startOfHour(new Date()).getMinutes();
        this.bookAllowFrom = bookAllowFromHour * 60 + bookAllowFromMinute;
      }
      else {
        this.bookAllowFrom = 0
      }
    //if (i.getDay() !== 0 && i.getDay() !== 6) 


    if (!this.weekendDays.includes(i.getDay())) {       
      for (let j = this.dayStart > this.bookAllowFrom ? this.dayStart : this.bookAllowFrom;
        j + this.sessionTaken <= this.lunchBreakStart;
        j = j + this.sessionTaken) {
        console.log(j);
        this.events.push({
          title: '',
          start: addMinutes(i, j),
          end: addMinutes(i, j + this.sessionTaken),
          color: colors.green,
          meta: {
            incrementsBadgeTotal: true,
          },
        });
      }

      for (let j = this.lunchBreakEnd > this.bookAllowFrom ? this.lunchBreakEnd : this.bookAllowFrom;
        j + this.sessionTaken <= this.dayEnd;
        j = j + this.sessionTaken) {
        this.events.push({
          title: '',
          start: addMinutes(i, j),
          end: addMinutes(i, j + this.sessionTaken),
          color: colors.green,
          meta: {
            incrementsBadgeTotal: true,
          },
        });
      }
    }
    // for (let i = startOfTomorrow();
    //   isBefore(i, endOfMonth(addMonths(new Date(), 1)));
    //   i = addDays(i, 1)) {
    //     if (! this.weekendDays.includes(i.getDay()) ) {
    //       for (let j = this.dayStartHour; j < this.dayEndHour; j++) {
    //         if (j != this.lunchBreakStart) {
    //           this.events.push({
    //             title: '',
    //             start: addHours(i, j),
    //             end: addHours(i, j + 1),
    //             color: colors.green,
    //             meta: {
    //               incrementsBadgeTotal: true,
    //             },
    //           }
    //           );
    //         }
    //       }
    //   }
    // }

    }
  }


  changeDay(date: Date) {
    if ( !isBefore(  date, startOfToday()) ){
      this.viewDate = date;
      console.log(this.viewDate);
      this.viewDate.setDate(this.viewDate.getDate() - this.viewDateDec);
      console.log(this.viewDate);
      console.log(this.viewDateDec);
      this.view = CalendarView.Week;
    }
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log("1 " + this.isLoggedIn);
    //this.keycloakService.isLoggedIn().then(status => { this.isLoggedIn = status; console.log("2 " +this.isLoggedIn); });
    console.log("3 " + this.isLoggedIn);

    var loginPromise =  this.keycloakService.isLoggedIn();
    loginPromise.then((value) => {
      if (value) {
        ///console.log('Event clicked ' + value);
        //console.log(event.color);
        if (JSON.stringify(event.color) === JSON.stringify(colors.green)) {
          if (confirm("Confirm booking?")) {
            var eventCopy = event;
            eventCopy.color = colors.red;
            eventCopy.meta.email = this.userProfile.email;
            console.log(eventCopy.meta.email);
            console.log(this.userProfile.email);
            console.log(eventCopy);
            this.bookingService.createBooking(eventCopy).subscribe(
              response => {
                this.events = this.events.map((iEvent) => {
                  //console.log(iEvent);
                  if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z")) {
                    console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                    iEvent.color = eventCopy.color;
                    iEvent.meta.incrementsBadgeTotal = false;
                    iEvent.meta.email = eventCopy.meta.email;
                  }
                  console.log('iEvent ' );
                  console.log(iEvent);
                  return iEvent;
                });
                console.log(response);
                this.updateWithBackEndData();
              },
              error => {
                console.log(error);
              }
            );
            console.log('Event clicked', event);
          }
          return value;
        }
        else if ( ( JSON.stringify(event.color) === JSON.stringify(colors.red ) ) &&
                  ( event.meta.email != null || "" ) &&
                  ( event.meta.email === this.userProfile.email ) ) {
          if (confirm("Cancel booking?")) {
            var eventCopy = event;
            eventCopy.color = colors.green;
            eventCopy.id = event.id;
            this.bookingService.deleteBooking(event.id).subscribe(
              response => {
                this.events = this.events.map((iEvent) => {
                  if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z")) {
                    console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                    iEvent.color = eventCopy.color;
                    iEvent.id = null;
                    iEvent.meta.incrementsBadgeTotal = true;
                    iEvent.meta.email = null;
                  }
                  return iEvent;
                });

                console.log(response);
                this.updateWithBackEndData();
              },
              error => {
                console.log(error);
              }
            );
            console.log('Event clicked', event);
          }
          return value;
        }
      }
      else {
        console.log("4 " + this.isLoggedIn);
        this.keycloakService.login(
          {redirectUri: "http://localhost:4200/select",}
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
    });
    console.log('beforeRender');
  }

  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
  }

  beforeWeekOrDayViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    this.hourColumns = event.hourColumns;
  }

}
