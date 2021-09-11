import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ApptBookingEventComponent } from '../appt-booking-event.component';

import {Event} from '../event.model'
import {EventsService} from '../event.service';

@Component({
  selector: 'app-appt-booking-a-event',
  templateUrl: './appt-booking-a-event.component.html',
  styleUrls: ['./appt-booking-a-event.component.css']
})
export class ApptBookingAEventComponent implements OnInit {
  @Input() event: {eid:string,title: string,
    bEmail: string,bName: string,bPhone: string,
    description: string,
    startTime: string,endTime:string,
    city: string,street: string,postCode: string,
    price:number,location:any};
  @Input() id: number;

  @ViewChild('f', { static: false }) signupForm: NgForm;

  aevent={
    title:'',
    bEmail:'',
    bName:'',
    bPhone:'',
    description:'',
    sTime:'',
    eTime:'',
    city:'',
    postCode:'',
    street:'',
    price:0,
  }

  modifyFlag=false
  constructor(private eventsService:EventsService,private updateEvent:ApptBookingEventComponent) { }

  ngOnInit(): void {
    console.log('aaa',this.event)
    this.aevent.title=this.event.title
    this.aevent.description = this.event.description;
    this.aevent.price = this.event.price;

    // this.aevent.bEmail = this.event.bEmail;
    // this.aevent.bName = this.event.bName;
    // this.aevent.bPhone = this.event.bPhone;
    
    this.aevent.sTime = this.event.startTime;
    this.aevent.eTime = this.event.endTime;

    this.aevent.city = this.event.location.city;
    this.aevent.postCode = this.event.location.postCode;
    this.aevent.street = this.event.location.street;

    console.log('hi',this.event)
  }

  goModify(){
    this.modifyFlag=true
  }

  goDelete(){
    this.eventsService.deleteEvent(this.event.eid).subscribe(() => {
      // this.updateEvent.getAllEvents()
    });
    alert('Delete Successfully')
  }

  noModify(){
    this.modifyFlag=false
  }

  onSubmit(){
    var now = new Date().toISOString();
    now=now.slice(0,17)
    now=now+'60Z'

    var timeIssue=false
    if(this.signupForm.value.eventData.title!=''){
    this.aevent.title = this.signupForm.value.eventData.title
    }
    if(this.signupForm.value.eventData.description!=''){
      this.aevent.description = this.signupForm.value.eventData.description;
    }
    if(this.signupForm.value.eventData.price!=''){
      this.aevent.price = this.signupForm.value.eventData.price;
    }

    // this.aevent.bEmail = this.signupForm.value.eventData.bEmail;
    // this.aevent.bName = this.signupForm.value.eventData.bName;
    // this.aevent.bPhone = this.signupForm.value.eventData.bPhone;

    if(this.signupForm.value.eventData.sTime!=''){
      if(this.signupForm.value.eventData.ssTime!=''){
        // timeIssue=false
        this.aevent.sTime = this.signupForm.value.eventData.sTime+'T'+this.signupForm.value.eventData.ssTime+':30'+'Z';
      }
      else{
        timeIssue=true
        alert("Please choose a start time")
      }
    }
    if(this.signupForm.value.eventData.eTime!=''){
      if(this.signupForm.value.eventData.eeTime!=''){
        // timeIssue=false
        this.aevent.eTime = this.signupForm.value.eventData.eTime+'T'+this.signupForm.value.eventData.eeTime+':30'+'Z';
      }
      else{
        timeIssue=true
        alert("Please choose a end time")
      }
    }

    if(this.aevent.sTime<now){
      timeIssue=true
      alert('This event cannot start before the current time')
    }
    else if(this.aevent.eTime<this.aevent.sTime){
      timeIssue=true
      alert("The end time cannot be earlier than the start time!")
    }

    if(this.signupForm.value.eventData.city!=''){
      this.aevent.city = this.signupForm.value.eventData.city;
    }
    if(this.signupForm.value.eventData.postCode!=''){
      this.aevent.postCode = this.signupForm.value.eventData.postCode;
    }
    if(this.signupForm.value.eventData.street!=''){
      this.aevent.street = this.signupForm.value.eventData.street;
    }

    if(!timeIssue){
      this.eventsService.modifyEvent(this.event.eid,this.aevent.title,this.aevent.price,this.aevent.sTime,this.aevent.eTime,
        // this.event.bEmail,this.event.bName,this.event.bPhone,
        this.aevent.city,this.aevent.postCode,this.aevent.street,
        this.aevent.description).subscribe(()=>{
          // this.updateEvent.getAllEvents()
        })
  
      this.signupForm.reset();
      this.modifyFlag=false
    }
  }
}
