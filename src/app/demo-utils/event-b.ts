import { CalendarEvent,WeekDay, WeekViewHourSegment, WeekViewHourColumn, EventAction, EventColor } from 'calendar-utils';

export interface BookingEvent extends CalendarEvent<any> {
  _id?: string | number;
  startString?: string;
  endString?: string;
};
