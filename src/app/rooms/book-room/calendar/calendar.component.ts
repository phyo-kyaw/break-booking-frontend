// https://stackblitz.com/edit/no-duplicate-events-angular-calendar?file=src%2Fapp%2Fapp.component.ts

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarEventTitleFormatter,
  CalendarWeekViewBeforeRenderEvent
} from 'angular-calendar';
import { colors } from 'app/appt-booking-utils/colors';
import { WeekViewHourSegment } from 'calendar-utils';
import { addDays, addMinutes, endOfWeek, isSameDay } from 'date-fns';
import * as dayjs from 'dayjs';
import { fromEvent, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

// @Injectable()
// export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
//   constructor(@Inject(LOCALE_ID) private locale: string) {
//     super();
//   }
//   week(event: CalendarEvent): string {
//     return `${event.title} <b>${formatDate(
//       event.start,
//       'h:mm a',
//       this.locale
//     )} - ${formatDate(event.end, 'h:mm a', this.locale)}</b>`;
//   }
// }
function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}
const dateFormat = 'YYYY-MM-DD[T]HH:mm:ss'; // example:  2021-09-19T06:00:00

@Component({
  selector: 'app-room-book-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: CalendarEventTitleFormatter
      // useClass: CustomEventTitleFormatter
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class RoomBookCalendarComponent implements OnInit {
  @Output() mouseReleased = new EventEmitter();
  @Input() preBookedTimes: [{ start: string; end: string }];
  @Input() dayStartTime: number = 7;
  @Input() dayEndTime: number = 18;
  viewDate = new Date();
  events: CalendarEvent[] = [];
  dragToCreateActive = false;
  eventOverlap = false;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 1;
  refresh$ = new Subject();
  hourSegment = 1;
  finalData: {
    endTime: string;
    endWeekday: number;
    maxPower: number;
    smartAlgorithmSchedulingEntry: boolean;
    startTime: string;
    startWeekday: number;
  }[];
  data: any;
  minDate: Date = new Date();

  constructor(private cdr: ChangeDetectorRef) {}

  dateIsValid(date: Date): boolean {
    return date >= this.minDate;
  }

  beforeViewRender(body: CalendarWeekViewBeforeRenderEvent): void {
    body.hourColumns.forEach(hourCol => {
      hourCol.hours.forEach(hour => {
        hour.segments.forEach(segment => {
          if (!this.dateIsValid(segment.date)) {
            segment.cssClass = 'cal-disabled';
          }
        });
      });
    });
  }

  resetEvents = () => {
    this.mouseReleased.emit([]);
    this.events = this.createAlreadyBookedEvents();
  };

  ngOnInit() {
    this.events = this.createAlreadyBookedEvents();
  }

  createAlreadyBookedEvents() {
    return this.preBookedTimes.map(times => {
      return {
        title: 'Unavaliable',
        start: new Date(times.start),
        end: new Date(times.end),
        color: colors.red
      };
    });
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Your booking',
      start: segment.date,
      end: addMinutes(segment.date, 60),
      meta: {
        tmpEvent: true
      },
      resizable: {
        beforeStart: true,
        afterEnd: true
      },

      draggable: true
    };
    this.events = [...this.events, dragToSelectEvent];
    this.refresh$.next();
    // console.log(this.events);
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          const x = {
            event: dragToSelectEvent,
            newStart: segment.date,
            newEnd: dragToSelectEvent.end
          };
          const isValid = this.validateEventTimesChanged(x);
          if (
            dragToSelectEvent.end > segment.date &&
            dragToSelectEvent.end < endOfView &&
            isValid
          ) {
            // console.log('OKOKOK');
          } else {
            // console.log('NAHHH');
            // this.events = this.events.filter((e) => e.id !== dragToSelectEvent.id);
            return;
          }
          this.refresh$.next();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          (mouseMoveEvent.clientY - segmentPosition.top) * 2,
          60
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        const x = {
          event: dragToSelectEvent,
          newStart: segment.date,
          newEnd: newEnd
        };
        const isValid = this.validateEventTimesChanged(x);
        if (newEnd > segment.date && newEnd < endOfView && isValid) {
          // console.log('OKOKOK');

          dragToSelectEvent.end = newEnd;
        } else {
          // console.log('NAHH');
          //this.events = this.events.filter((e) => e.id !== dragToSelectEvent.id);
        }
        this.refresh();
      });
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  mouseUp() {
    // Format string to ISO 8601 without miliseconds
    const formattedEvents = this.events.map(event => {
      return {
        start: dayjs(event.start).format(dateFormat),
        end: dayjs(event.end).format(dateFormat)
      };
    });

    // Filter out the pre booked times
    const newEvents = formattedEvents.slice(this.preBookedTimes.length);

    this.mouseReleased.emit(newEvents);
  }

  validateEventTimesChanged = (
    { event, newStart, newEnd, allDay }: any,
    addCssClass = true
  ) => {
    this.refresh();

    if (event.allDay) {
      return true;
    }

    delete event.cssClass;
    // don't allow dragging or resizing events to different days
    const sameDay = isSameDay(newStart, newEnd);

    if (!sameDay) {
      return false;
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find(otherEvent => {
      return (
        otherEvent !== event &&
        !otherEvent.allDay &&
        ((otherEvent.start < newStart && newStart < otherEvent.end) ||
          (otherEvent.start < newEnd && newStart < otherEvent.end))
      );
    });

    if (overlappingEvent) {
      if (addCssClass) {
        this.eventOverlap = true;
        setTimeout(() => {
          this.eventOverlap = false;
        }, 2000);
      }
      return false;
    }

    // Don't allow dragging to the past
    if (!this.dateIsValid(newStart) || !this.dateIsValid(newEnd)) {
      return false;
    }

    return true;
  };

  eventTimesChanged(
    eventTimesChangedEvent: CalendarEventTimesChangedEvent
  ): void {
    // console.log(eventTimesChangedEvent);
    delete eventTimesChangedEvent.event.cssClass;
    if (this.validateEventTimesChanged(eventTimesChangedEvent, true)) {
      const { event, newStart, newEnd } = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;
      this.refresh$.next();
    }
  }
}
