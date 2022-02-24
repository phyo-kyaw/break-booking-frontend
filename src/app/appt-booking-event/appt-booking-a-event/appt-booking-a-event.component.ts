import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApptBookingEventComponent } from '../appt-booking-event.component';

import { Event } from '../event.model';
import { EventsService } from '../event.service';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

@Component({
  selector: 'app-appt-booking-a-event',
  templateUrl: './appt-booking-a-event.component.html',
  styleUrls: ['./appt-booking-a-event.component.css']
})
export class ApptBookingAEventComponent implements OnInit {
  @Input() event: {
    eid: string;
    title: string;
    bEmail: string;
    bName: string;
    bPhone: string;
    description: string;
    startTime: string;
    endTime: string;
    city: string;
    street: string;
    postCode: string;
    price: number;
    location: any;
  };
  @Input() id: number;
  @Input() add: boolean;

  // @ViewChild('f', { static: false }) signupForm: NgForm;

  detail = true;

  // aevent={
  //   title:'',
  //   bEmail:'',
  //   bName:'',
  //   bPhone:'',
  //   description:'',
  //   sTime:'',
  //   eTime:'',
  //   city:'',
  //   postCode:'',
  //   street:'',
  //   price:0,
  //   add:false
  // }

  modifyFlag = false;
  constructor(
    private eventsService: EventsService,
    private updateEvent: ApptBookingEventComponent
  ) {}

  ngOnInit(): void {
    console.log('aaa!!', this.event);
    console.log('add', this.add);
    // this.aevent.title=this.event.title
    // this.aevent.description = this.event.description;
    // this.aevent.price = this.event.price;

    // // this.aevent.bEmail = this.event.bEmail;
    // // this.aevent.bName = this.event.bName;
    // // this.aevent.bPhone = this.event.bPhone;

    // this.aevent.sTime = this.event.startTime;
    // this.aevent.eTime = this.event.endTime;

    // this.aevent.city = this.event.location.city;
    // this.aevent.postCode = this.event.location.postCode;
    // this.aevent.street = this.event.location.street;

    // this.aevent.add = this.event.add;

    // console.log('hi',this.event)
  }

  // goModify(){
  //   this.modifyFlag=true
  // }

  // goDelete(){
  //   this.eventsService.deleteEvent(this.event.eid).subscribe(() => {
  //     // this.updateEvent.getAllEvents()
  //   });
  //   alert('Delete Successfully')
  // }

  // noModify(){
  //   this.modifyFlag=false
  // }

  showDetail() {
    this.detail = !this.detail;
    console.log('aaa', this.detail);
  }

  modifyEvent(event) {
    console.log('hi modify', event);
    if (event.startTime > event.endTime) {
      alert('The end time cannot be earlier than the start time!');
      this.updateEvent.getAllEvents();
      return;
    }
    this.eventsService
      .modifyEvent(
        event.eid,
        event.title,
        event.price,
        event.startTime,
        event.endTime,
        // this.event.bEmail,this.event.bName,this.event.bPhone,
        event.location.city,
        event.location.postCode,
        event.location.street,
        event.description
      )
      .subscribe(() => {
        this.updateEvent.getAllEvents();
      });
  }

  addEventConfirm(event) {
    console.log('Add', event);
    console.log('aasdsadsa', event.startTime);
    if (event.startTime > event.endTime) {
      alert('The end time cannot be earlier than the start time!');
      return;
    }
    if (event.title == '') {
      alert('Event Title cannot be empty!');
      return;
    }
    let start, startM, startD, startH, startMi;
    let end, endM, endD, endH, endMi;
    if (event.startTime.getMonth() + 1 < 10) {
      startM = '0' + (event.startTime.getMonth() + 1);
    } else {
      startM = event.startTime.getMonth() + 1;
    }
    if (event.startTime.getDate() < 10) {
      startD = '0' + event.startTime.getDate();
    } else {
      startD = event.startTime.getDate();
    }
    if (event.startTime.getHours() < 10) {
      startH = '0' + event.startTime.getHours();
    } else {
      startH = event.startTime.getHours();
    }
    if (event.startTime.getMinutes() < 10) {
      startMi = '0' + event.startTime.getMinutes();
    } else {
      startMi = event.startTime.getMinutes();
    }
    start =
      event.startTime.getFullYear() +
      '-' +
      startM +
      '-' +
      startD +
      'T' +
      startH +
      ':' +
      startD +
      ':30';

    if (event.endTime.getMonth() + 1 < 10) {
      endM = '0' + (event.endTime.getMonth() + 1);
    } else {
      endM = event.endTime.getMonth() + 1;
    }
    if (event.endTime.getDate() < 10) {
      endD = '0' + event.endTime.getDate();
    } else {
      endD = event.endTime.getDate();
    }
    if (event.endTime.getHours() < 10) {
      endH = '0' + event.endTime.getHours();
    } else {
      endH = event.endTime.getHours();
    }
    if (event.endTime.getMinutes() < 10) {
      endMi = '0' + event.endTime.getMinutes();
    } else {
      endMi = event.endTime.getMinutes();
    }
    end =
      event.endTime.getFullYear() +
      '-' +
      endM +
      '-' +
      endD +
      'T' +
      endH +
      ':' +
      endMi +
      ':30';
    this.eventsService
      .addNewEvent(
        event.title,
        event.price,
        start,
        end,
        // this.event.bEmail,this.event.bName,this.event.bPhone,
        event.location.city,
        event.location.postCode,
        event.location.street,
        event.description
      )
      .subscribe(() => {
        this.updateEvent.getAllEvents();
      });
  }

  deleteEvent(event, eventToDelete: CalendarEvent) {
    console.log('hi Delete', event);
    this.eventsService.deleteEvent(event.eid).subscribe(() => {
      this.updateEvent.getAllEvents();
    });
    this.updateEvent.events = this.updateEvent.events.filter(
      event => event !== eventToDelete
    );
  }
}
