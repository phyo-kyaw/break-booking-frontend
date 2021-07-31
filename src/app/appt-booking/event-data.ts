import { CalendarEvent } from 'angular-calendar';

export interface ApptBookingData extends CalendarEvent {
  apptBookingEntityGid: string;
  apptBookingEntityName?: string;
  apptBookerEmail?: string;
  apptBookerPhone?: string;
  apptBookerName?: string;

};
