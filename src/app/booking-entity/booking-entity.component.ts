import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { startOfToday } from 'date-fns';
import { TimeFormatterPipe } from 'ngx-material-timepicker/src/app/material-timepicker/pipes/time-formatter.pipe';
import { TimeM, DurationM, Break, _BookingEntity } from './models'
import { Guid } from "guid-typescript";

import { BookingEntityDataService } from 'app/service/data/booking-entity-data.service';

@Component({
  selector: 'app-booking-entity',
  templateUrl: './booking-entity.component.html',
  styleUrls: ['./booking-entity.component.css']
})
export class BookingEntityComponent implements OnInit {

  bookingEntity: _BookingEntity;
  
  title_1: string;
  title_2: string;
  email: string;
  phone='+61';
  startDate: Date = startOfToday();

  minAdvanceBookingUnit = "hour"
  minAdvanceBooking = 2;
  maxAdvanceBookingInDay = 100;

  dayStartM: TimeM = { hour: 9, minute: 30 };
  dayEndM: TimeM = { hour: 17, minute: 30 };
  
  breakStartM: TimeM = { hour: 13, minute: 30 };
  breakDurationM: DurationM = { hour: 1, minute: 0 };

  workingDays: number[];

  meridian = true;  

  objects = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" }
  ]
 


  constructor(
    private bookingEntityDataService: BookingEntityDataService,
  ) {
    this.bookingEntity ={
      gid:  Guid.create().toString(),
      "title_1":"",
      "title_2":"",
      "email":"",
      "phone":"+61",
      startDate: new Date(),
      "minAdvanceBookingUnit":"hour",
      "minAdvanceBooking":2,
      "maxAdvanceBookingInDay": 100,
      "sessionM":{
        "hour":0,
        "minute":30
     },
      "dayStartM":{
         "hour":9,
         "minute":30
      },
      "dayEndM":{
         "hour":17,
         "minute":30
      },
      "breakStartM":{
         "hour":13,
         "minute":30
      },
      "breakDurationM":{
         "hour":1,
         "minute":0
      },
      "workingDays": []
   }
   
    console.log(this.bookingEntity);
  }

  ngOnInit(): void {
    //this.workingDays = new Array<number>();
  }

  getDayId(e: any, id: number) {
    if (e.target.checked) {
      console.log(id + ' checked ' );
      this.bookingEntity.workingDays.push(id);
    }
    else if (e.target.unchecked) {
      console.log(id + ' unchecked ');
      this.bookingEntity.workingDays = this.bookingEntity.workingDays.filter(m => m != id);
    }
    console.log(this.bookingEntity.workingDays);
  }

  getEndTime(time:Time): void  {
    console.log(time);
  }

  showTime() {
    //console.log(this.startTime);
  }

  createEntityBooking() {

    //this.bookingEntity.gid = Guid.create();
    // console.log(this.title_1);
    // console.log(this.title_2);
    // console.log(this.email);

    // console.log(this.dayStartM);
    // this.bookingEntity.title_1 = this.title_1;
    // this.bookingEntity.title_2 = this.title_2;
    // this.bookingEntity.email = this.email;
    // this.bookingEntity.phone = this.phone;
    // this.bookingEntity.startDate = this.startDate;
    
  
    // this.bookingEntity.minAdvanceBookingUnit = this.minAdvanceBookingUnit;
    // this.bookingEntity.minAdvanceBooking = this.minAdvanceBooking;
    // this.bookingEntity.maxAdvanceBookingInDay = this.maxAdvanceBookingInDay;
  
    // this.bookingEntity.dayStartM = this.dayStartM;
    // this.bookingEntity.dayEndM = this.dayEndM;
    
    // this.bookingEntity.breakStartM = this.breakStartM;
    // this.bookingEntity.breakDurationM = this.breakDurationM;
    console.log(this.bookingEntity);

    this.bookingEntityDataService.retrieveAllBookingEntities().subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );




    this.bookingEntityDataService.createBookingEntity(this.bookingEntity).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );

    this.bookingEntityDataService.retrieveAllBookingEntities().subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }

}
