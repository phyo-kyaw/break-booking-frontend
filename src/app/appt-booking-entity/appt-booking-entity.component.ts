import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import { startOfToday } from 'date-fns';
import { TimeFormatterPipe } from 'ngx-material-timepicker/src/app/material-timepicker/pipes/time-formatter.pipe';
import { TimeM, DurationM, Break, ApptBookingEntity, WorkSession, WorkSessionCheckBox } from './models'
import { Guid } from "guid-typescript";

import { ApptBookingEntityDataService } from 'app/service/data/appt-booking-entity-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-appt-booking-entity',
  templateUrl: './appt-booking-entity.component.html',
  styleUrls: ['./appt-booking-entity.component.css']
})
export class ApptBookingEntityComponent implements OnInit {

  bookingEntity: ApptBookingEntity;

  gid: string;

  title_1: string;
  title_2: string;
  email: string;
  phone: string = '+61';
  startDate: Date;

  minAdvanceBookingUnit;
  minAdvanceBooking;
  maxAdvanceBookingInDay;

  amStartM: TimeM;
  amEndM: TimeM;

  pmStartM: TimeM;
  pmEndM: TimeM;

  // workingDays: WorkSession[];

  mobNumberPattern: string; // = "^((\\+61-?)|0)?[0-9]{10}$";

  meridian = true;

  //objects: { [id: workSession]: any } = { };

  // objects = [
  //   { id: 0, name: "Sunday", isChecked: false },
  //   { id: 1, name: "Monday", isChecked: true },
  //   { id: 2, name: "Tuesday", isChecked: true },
  //   { id: 3, name: "Wednesday", isChecked: true },
  //   { id: 4, name: "Thursday", isChecked: true },
  //   { id: 5, name: "Friday", isChecked: true },
  //   { id: 6, name: "Saturday", isChecked: false },
  // ]

  workingWeekDays: WorkSessionCheckBox[] = [
    { id: { day: 0, session: "AM" }, name: "AM Sunday", isChecked: false },
    { id: { day: 0, session: "PM" }, name: "PM Sunday", isChecked: false },
    { id: { day: 1, session: "AM" }, name: "AM Monday", isChecked: true },
    { id: { day: 1, session: "PM" }, name: "PM Monday", isChecked: true },
    { id: { day: 2, session: "AM" }, name: "AM Tuesday", isChecked: true },
    { id: { day: 2, session: "PM" }, name: "PM Tuesday", isChecked: true },
    { id: { day: 3, session: "AM" }, name: "AM Wednesday", isChecked: true },
    { id: { day: 3, session: "PM" }, name: "PM Wednesday", isChecked: true },
    { id: { day: 4, session: "AM" }, name: "AM Thursday", isChecked: true },
    { id: { day: 4, session: "PM" }, name: "PM Thursday", isChecked: true },
    { id: { day: 5, session: "AM" }, name: "AM Friday", isChecked: true },
    { id: { day: 5, session: "PM" }, name: "PM Friday", isChecked: true },
    { id: { day: 6, session: "AM" }, name: "AM Saturday", isChecked: false },
    { id: { day: 6, session: "PM" }, name: "PM Saturday", isChecked: false },
  ]

  constructor(
    private bookingEntityDataService: ApptBookingEntityDataService,
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
      "amStartM":{
         "hour":9,
         "minute":30
      },
      "amEndM":{
         "hour":12,
         "minute":30
      },
      "pmStartM":{
         "hour":14,
         "minute":0
      },
      "pmEndM":{
         "hour":17,
         "minute":0
      },
      "workingDays": [
        { day: 1, session: "AM" }, { day: 1, session: "PM" },
        { day: 2, session: "AM" }, { day: 2, session: "PM" },
        { day: 3, session: "AM" }, { day: 3, session: "PM" },
        { day: 4, session: "AM" }, { day: 4, session: "PM" },
        { day: 5, session: "AM" }, { day: 5, session: "PM" },
      ]
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


          this.bookingEntity = response as ApptBookingEntity;
          //this.dayStartHour = this.bookingEntity.dayStartM.hour;
          //this.dayStartMinute = this.bookingEntity.dayStartM.minute;
          console.log(this.bookingEntity);

          for (var object of this.workingWeekDays) {
            console.log(this.bookingEntity.workingDays.filter(s =>
              s.day === object.id.day && s.session === object.id.session).length);
            if (this.bookingEntity.workingDays.filter(s =>
              s.day === object.id.day && s.session === object.id.session).length == 1 ) {
            //if (this.bookingEntity.workingDays.includes(object.id)) {
              console.log(this.bookingEntity.workingDays);
              //this.objects[object.id].isChecked = true;
              this.workingWeekDays = this.workingWeekDays.map((session) => {
                if ( JSON.stringify(session.id) === JSON.stringify(object.id) ) {
                  session.isChecked = true;
                }
                return session;
              });
            }
            else {
              //this.objects[object.id].isChecked = false;
              this.workingWeekDays = this.workingWeekDays.map((session) => {
                if ( JSON.stringify(session.id) === JSON.stringify(object.id) ) {
                  session.isChecked = false;
                }
                return session;
              });
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

      for (var object of this.workingWeekDays) {
        if (this.bookingEntity.workingDays.filter(s =>
          s.day === object.id.day && s.session === object.id.session).length == 1) {

          //this.objects[object.id].isChecked = true;
          this.workingWeekDays = this.workingWeekDays.map((session) => {
            if ( JSON.stringify(session.id) === JSON.stringify(object.id) ) {
              session.isChecked = true;
            }
            return session;
          });
        }
        else {
          //this.objects[object.id].isChecked = false;
          this.workingWeekDays = this.workingWeekDays.map((session) => {
            if ( JSON.stringify(session.id) === JSON.stringify(object.id) ) {
              session.isChecked = false;
            }
            return session;
          });
        }
      }
      console.log('this.bookingEntity.workingDays');
      console.log(this.bookingEntity.workingDays);
      console.log('this.workingWeekDays');
      console.log(this.workingWeekDays);
    }

    //console.log(this.bookingEntity.workingDays);
    //this.workingDays = this.bookingEntity.workingDays;
    //this.workingDays = new Array<number>();
    // for (var object of this.objects) {
    //   if (this.bookingEntity.workingDays.includes(object.id)) {
    //     console.log(this.bookingEntity.workingDays);
    //     this.objects[object.id].isChecked = true;
    //   }
    //   else {
    //     this.objects[object.id].isChecked = false;
    //   }
    // }

  }

  getDayId(e: any, id: WorkSession) {
    console.log(e);
    if (e.target.checked) {
      console.log(id + ' checked ');
      //this.bookingEntity.workingDays.push(id);
      //this.objects[id].isChecked = true;
      this.bookingEntity.workingDays.push(id);
      //this.workingWeekDays[id].isChecked = true;
      this.workingWeekDays = this.workingWeekDays.map((session) => {
        if ( JSON.stringify(session.id) === JSON.stringify(id) ) {
          session.isChecked = true;
        }
        return session;
      });
    }
    else { //if (e.target.unchecked) {
      console.log(id + ' unchecked ');
      this.bookingEntity.workingDays = this.bookingEntity.workingDays.filter(m => JSON.stringify(m) !== JSON.stringify(id) );
      //this.objects[id].isChecked = false;
      this.workingWeekDays = this.workingWeekDays.map((session) => {
        if ( JSON.stringify(session.id) === JSON.stringify(id) ) {
          session.isChecked = false;
        }
        return session;
      });
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
