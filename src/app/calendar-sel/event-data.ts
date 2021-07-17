import { CalendarEvent } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
export interface EventData extends CalendarEvent {
  bookingEntityGid: string;
  bookingEntityName?: string;
  bookerEmail?: string;
  bookerPhone?: string;
  bookerName?: string;

  // id?: string;
  // title: string ;
  // start: string;
  // end?: string;
  // color: EventColor;
  // meta?: any;
};
