import { CalendarEvent } from 'angular-calendar';

export interface ApptBookingData extends CalendarEvent {
  bookingEntityGid: string;
  bookingEntityName?: string;
  bookerEmail?: string;
  bookerPhone?: string;
  bookerName?: string;

};
