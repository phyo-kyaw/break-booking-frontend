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
        min-height: 75px;
      }
      .cal-month-view .cal-day-cell.cal-today {
        background-color: #e8fde7;
      }
      .cal-month-view .cal-cell-top {
        min-height: 50px;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
      }

      .cal-month-view .cal-cell-foot {
        min-height: 25px;
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
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  // ngOnDestroy(): void {
  //   throw new Error('Method not implemented.');
  // }
  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  selectedMonthViewDay: CalendarMonthViewDay;

  selectedDayViewDate: Date;

  weekStartsOn: number = DAYS_OF_WEEK.SUNDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];

  hourColumns: WeekViewHourColumn[];

  hourSegmentHeight: number = 50;

  hourSegments: number = 1;

  dayStartHour: number = 9;

  dayEndHour: number = 17;
  lunchBreakHourStart: number = 13;

  LastSessionHour: number = this.dayEndHour - 1;
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  eventDataArry: EventData[] = [];
  // events: CalendarEvent[] = [
  //   {
  //     title: '',
  //     start: addHours(startOfDay(new Date()), 10),//new Date("2021-05-21T09:00:00"),
  //     end: addHours(startOfDay(new Date()), 11),//new Date("2021-05-21T09:00:00"),
  //     //color: colors.red,
  //     color:{primary: "#ad2121", secondary: "#FAE3E3"},
  //   },
  // ];

  //eventBs: EventB[] = [];
  eventBook: BookingEvent;
  //   {
  //     _id: '',
  //     title: '',
  //     start: addHours(startOfDay(new Date()), 12),//new Date("2021-05-21T09:00:00"),
  //     end: addHours(startOfDay(new Date()), 13),//new Date("2021-05-21T09:00:00"),
  //     color: colors.red,
  //     //color: { primary: "#ad2121", secondary: "#FAE3E3" },
  //   };

  eventBs: BookingEvent[];

  //eveA: CalendarEvent[] = [];
  eveA: CalendarEvent[] = [
    // {
    //   title: '',
    //   start: addHours(startOfDay(new Date()), 10),//new Date("2021-05-21T09:00:00"),
    //   end: addHours(startOfDay(new Date()), 11),//new Date("2021-05-21T09:00:00"),
    //   color: colors.red,
    //   //color:{primary: "#ad2121", secondary: "#FAE3E3"},
    // },
    // //this.eventB,
  ];


  selectedDays: any = [];

  daysInWeek = 7;

  viewDateDec: number;

  private destroy$ = new Subject();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cd: ChangeDetectorRef,
    private bookingService:BookingDataService
  ) {}

  ngOnInit() {


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

    console.log(startOfMonth(new Date()));
    console.log(endOfMonth(new Date()));
    console.log(addMonths(startOfMonth(new Date()), 1));





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

    //console.log(this.eveA);
    //new Promise( resolve => setTimeout(resolve, 5000) );

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
              }
              return iEvent;
            });
          }
          //
        }
      },
      error => {
        console.log(error);
      }
    );
    this.refresh.next();
  }

  prepareFrontEndData(){

    let i = startOfToday();
    console.log(i.getDay() !== 0);
    console.log(i.getDay());
    if (i.getDay() !== 0 && i.getDay() !== 6){
      let bookAllowFrom : number = startOfHour(new Date()).getHours() + 2;
      for (let j = this.dayStartHour > bookAllowFrom ? this.dayStartHour : bookAllowFrom ;
              j < this.dayEndHour ;
              j++) {
        if (j != this.lunchBreakHourStart) {
          this.events.push({
            title: '',
            start: addHours(i, j),
            end: addHours(i, j+1),
            color: colors.green,
            meta: {
              incrementsBadgeTotal: true,
            },
          }
          );
        }
      }
    }

    //if (i.getDay() !== 0 && i.getDay() !== 6) {
    for (let i = startOfTomorrow();
      isBefore(i, endOfMonth(addMonths(new Date(), 1)));
      i = addDays(i, 1)) {
        if (i.getDay() !== 0 && i.getDay() !== 6) {
          for (let j = this.dayStartHour; j < this.dayEndHour; j++) {
            if (j != this.lunchBreakHourStart) {
              this.events.push({
                title: '',
                start: addHours(i, j),
                end: addHours(i, j + 1),
                color: colors.green,
                meta: {
                  incrementsBadgeTotal: true,
                },
              }
              );
            }
          }
      }
    }


  }

  //dayClicked(day: CalendarMonthViewDay, view : CalendarView): void{
    //new EventEmitter<CalendarView>().emit(CalendarView.Week);
    //console.log(view);
    //view = CalendarView.Week;
    //console.log(view);
    //console.log(WeekDay[]);


    // this.selectedMonthViewDay = day;
    // const selectedDateTime = this.selectedMonthViewDay.date.getTime();
    // const dateIndex = this.selectedDays.findIndex(
    //   (selectedDay) => selectedDay.date.getTime() === selectedDateTime
    // );
    // if (dateIndex > -1) {
    //   delete this.selectedMonthViewDay.cssClass;
    //   this.selectedDays.splice(dateIndex, 1);
    // } else {
    //   this.selectedDays.push(this.selectedMonthViewDay);
    //   day.cssClass = 'cal-day-selected';
    //   this.selectedMonthViewDay = day;
    // }
  //}

  changeDay(date: Date) {
    if ( !isBefore(  date, startOfToday()) ){
      this.viewDate = date;
      console.log(this.viewDate);
      this.viewDate.setDate(this.viewDate.getDate() - this.viewDateDec);
      console.log(this.viewDate);
      console.log(this.viewDateDec);
      this.view = CalendarView.Week;
    }
    //console.log(this.events[0].end);
    // this.events.push({
    //   title: this.eventBs[0].title,
    //   start: new Date(this.eventBs[0].start),
    //   end: new Date(this.eventBs[0].end),
    //   color: this.eventBs[0].color,
    // });

    //for(let eventB in this.eventBs)
      //this.events.map((iEvent) => iEvent.start.getTime() === Date.parse(eventB.start).getTime());
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
    console.log(event.color);
    console.log(colors.green);
    console.log(colors.red );
    console.log(event.color == colors.green );
    console.log(event.color == colors.red );
    if ( JSON.stringify(event.color) === JSON.stringify(colors.green) ) {
      if (confirm("Confirm booking?")) {
        var eventCopy = event;
        eventCopy.end = addHours(event.start, 1);
        eventCopy.color = colors.red;
        this.bookingService.createBooking(eventCopy).subscribe(
          response => {

            this.events = this.events.map((iEvent) => {
              //console.log(iEvent);
              if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z")) {
                console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                iEvent.color = eventCopy.color;
                iEvent.meta.incrementsBadgeTotal = false;
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
    }
    else if ( JSON.stringify(event.color) === JSON.stringify(colors.red) ) {
      if (confirm("Cancel booking?")) {
        var eventCopy = event;
        eventCopy.end = event.end;
        eventCopy.color = colors.green;
        eventCopy.id = event.id;
        this.bookingService.deleteBooking(event.id).subscribe(
          response => {

            this.events = this.events.map((iEvent) => {
              //console.log(iEvent);
              if (iEvent.start.getTime() === Date.parse(eventCopy.start + ".000Z")) {
                console.log("iii " + iEvent.start.getTime() + " - " + Date.parse(eventCopy.start + ".000Z"));
                iEvent.color = eventCopy.color;
                iEvent.id = null;
                iEvent.meta.incrementsBadgeTotal = true;
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
    }

  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    this.updateWithBackEndData();
    body.forEach((day) => {
      // if (
      //   this.selectedDays.some(
      //     (selectedDay) => selectedDay.date.getTime() === day.date.getTime()
      //   )
      // ) {
      //   day.cssClass = 'cal-day-selected';
      // }
      day.badgeTotal = day.events.filter(
        (event) => event.meta.incrementsBadgeTotal
      ).length;
      if (day.date.getDay() === 0 || day.date.getDay() === 6) {
        day.cssClass = 'cal-weekends';
      }
    });
  }

  hourSegmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    //this.addSelectedDayViewClass();
  }

  beforeWeekOrDayViewRender(event: CalendarWeekViewBeforeRenderEvent) {
    this.hourColumns = event.hourColumns;
    //this.addSelectedDayViewClass();
  }

  // private addSelectedDayViewClass() {
  //   this.hourColumns.forEach((column) => {
  //     column.hours.forEach((hourSegment) => {
  //       hourSegment.segments.forEach((segment) => {
  //         delete segment.cssClass;
  //         if (
  //           this.selectedDayViewDate &&
  //           segment.date.getTime() === this.selectedDayViewDate.getTime()
  //         ) {
  //           segment.cssClass = 'cal-day-selected';
  //           console.log(segment.date.getTime());
  //           console.log(segment.date);
  //           console.log(segment);
  //           //segment.isTimeLabel = true;
  //           //this.Calen
  //           console.log(hourSegment);
  //         }
  //       });
  //     });
  //   });
  // }

}
