import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { startOfToday } from 'date-fns';
import { TimeFormatterPipe } from 'ngx-material-timepicker/src/app/material-timepicker/pipes/time-formatter.pipe';
import { TimeM, DurationM, Break, _BookingEntity } from './models'
import { Guid } from "guid-typescript";

import { BookingEntityDataService } from 'app/service/data/booking-entity-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-booking-entity',
  templateUrl: './booking-entity.component.html',
  styleUrls: ['./booking-entity.component.css']
})
export class BookingEntityComponent implements OnInit {

  bookingEntity: _BookingEntity;

  gid: string;

  title_1: string;
  title_2: string;
  email: string;
  phone: string ='+61';
  startDate: Date;

  minAdvanceBookingUnit;
  minAdvanceBooking ;
  maxAdvanceBookingInDay;

  dayStartM: TimeM ;
  dayEndM: TimeM ;
  
  breakStartM: TimeM ;
  breakDurationM: DurationM ;

  workingDays: number[];

  mobNumberPattern: string; // = "^((\\+61-?)|0)?[0-9]{10}$";

  meridian = true;  

  objects = [
    { id: 0, name: "Sunday", isChecked: false },
    { id: 1, name: "Monday", isChecked: true },
    { id: 2, name: "Tuesday", isChecked: true },
    { id: 3, name: "Wednesday", isChecked: true },
    { id: 4, name: "Thursday", isChecked: true },
    { id: 5, name: "Friday", isChecked: true },
    { id: 6, name: "Saturday", isChecked: false },
  ]
 


  constructor(
    private bookingEntityDataService: BookingEntityDataService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookingEntity ={
      gid:  null,
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
      "intervalBreakM":{
        "hour":0,
        "minute":5
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
      "workingDays": [1,2,3,4,5]
    }

    this.mobNumberPattern = "^((\\+61-?)|0)[2-478][0-9]{8}$"; //'^(\+61|0)[2-478]([0-9]){8}$';
   
    console.log(this.bookingEntity);
  }

  ngOnInit(): void {

    this.gid = this.route.snapshot.paramMap.get('gid');
    console.log(this.gid);

    if ( ! (this.gid == null) ) {
      this.bookingEntityDataService.getBookingEntity(this.gid).subscribe(
        response => {
          console.log(response);
          console.log('select');
          
          
          this.bookingEntity = response as _BookingEntity;
          //this.dayStartHour = this.bookingEntity.dayStartM.hour;
          //this.dayStartMinute = this.bookingEntity.dayStartM.minute;
          console.log(this.bookingEntity);

          for (var object of this.objects) {
            if (this.bookingEntity.workingDays.includes(object.id)) {
              console.log(this.bookingEntity.workingDays);
              this.objects[object.id].isChecked = true;
            }
            else {
              this.objects[object.id].isChecked = false;
            }
          }
 
        },
        error => {
          console.log(error);
        }
      );
    }
    else {
      //this.bookingEntity.gid = Guid.create().toString();
    }
    
    //console.log(this.bookingEntity.workingDays);
    //this.workingDays = this.bookingEntity.workingDays;
    //this.workingDays = new Array<number>();
    for (var object of this.objects) {
      if (this.bookingEntity.workingDays.includes(object.id)) {
        console.log(this.bookingEntity.workingDays);
        this.objects[object.id].isChecked = true;
      }
      else {
        this.objects[object.id].isChecked = false;
      }
    }
    
  }

  getDayId(e: any, id: number) {
    console.log(e);
    if (e.target.checked) {
      console.log(id + ' checked ' );
      this.bookingEntity.workingDays.push(id);
      this.objects[id].isChecked = true;
    }
    else { //if (e.target.unchecked) {
      console.log(id + ' unchecked ');
      this.bookingEntity.workingDays = this.bookingEntity.workingDays.filter(m => m != id);
      this.objects[id].isChecked = false;
    }
    console.log(this.bookingEntity.workingDays);
    
  }

  getEndTime(time:Time): void  {
    console.log(time);
  }

  showTime() {
    //console.log(this.startTime);
  }

  onSubmit() {

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

    if (this.gid == null) {
      console.log('create');
      this.bookingEntity.gid = Guid.create().toString();

      this.bookingEntityDataService.createBookingEntity(this.bookingEntity).subscribe(
        response => {
          console.log(response);
          this.router.navigate(['list']);
        },
        error => {
          console.log(error);
        }
      );  

    }
    else {   
      console.log('update');
      this.bookingEntityDataService.updateBookingEntity(this.gid, this.bookingEntity).subscribe(
        response => {
          console.log(response);
          this.router.navigate(['list']);
        },
        error => {
          console.log(error);
        }
      );      
    }

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
