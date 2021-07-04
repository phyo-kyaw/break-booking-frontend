import { Guid } from "guid-typescript";

export interface WorkSession {
   day: number;
   session: string;
}

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
 
   amStartM: TimeM ;
   amEndM: TimeM;
   
   pmStartM: TimeM;
   pmEndM: TimeM;
 
   workingDays: WorkSession[];
}

export interface WorkSessionCheckBox {
   id: WorkSession;
   name: String;
   isChecked: boolean;
}
//{ id: { day: 0 , session: "A" }, name: "Sunday", isChecked: false }