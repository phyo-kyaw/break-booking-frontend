import { CalendarEvent } from 'angular-calendar';

export interface Event {
  // booking: {
  //   bookerEmail: string,
  //   bookerName: string,
  //   bookerPhone: string,
  //   // eventEid: string,
  //   id: string,
  //   // userId: string
  // },
  eid?: string;
  description: string;
  // eid: string,
  endTime: string;
  location: {
    city: string;
    postCode: string;
    street: string;
  };
  price: number;
  startTime: string;
  title: string;
}

export interface Booking {
  bookerEmail: string;
  bookerName: string;
  bookerPhone: string;
  eventEid: string;
  id: string;
  userId: string;
}
