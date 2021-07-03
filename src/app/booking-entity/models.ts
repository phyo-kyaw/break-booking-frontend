import { Guid } from "guid-typescript";

export interface TimeM {
   hour: number;
   minute: number;
}

export interface DurationM {
   hour: number;
   minute: number;
}

export interface Break {
   name: string;
   time: TimeM;
   duration: DurationM;
}

export interface _BookingEntity {

   gid: string;
   title_1: string;
   title_2: string;
   email: string;
   phone: string;
   startDate: Date;
 
   minAdvanceBookingUnit: string;
   minAdvanceBooking: number;
   maxAdvanceBookingInDay: number;
   
   sessionM: DurationM;
   intervalBreakM: DurationM;
 
   dayStartM: TimeM ;
   dayEndM: TimeM;
   
   breakStartM: TimeM;
   breakDurationM: DurationM;
 
   workingDays: number[];
}