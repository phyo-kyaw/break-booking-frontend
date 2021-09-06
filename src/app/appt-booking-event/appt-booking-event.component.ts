import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {Event} from './event.model'
import {EventsService} from './event.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-appt-booking-event',
  templateUrl: './appt-booking-event.component.html',
  styleUrls: ['./appt-booking-event.component.css']
})
export class ApptBookingEventComponent implements OnInit {

  @ViewChild('f', { static: false }) signupForm: NgForm;
  addFlag=false
  addControl="Add a New Event"
  deleteFlag=false
  deleteConfirmFlag=false
  event={
    title:'',
    bEmail:'',
    bName:'',
    bPhone:"",
    description:'',
    sTime:'',
    eTime:'',
    city:'',
    postCode:"",
    street:'',
    price:0,

  }

  events: Event[] = [];

  constructor(private http: HttpClient, private eventsService:EventsService) { }

  ngOnInit(): void {
    this.getAllEvents()
  }
  
  changeAddControl(){
    if(this.addFlag==true){
      this.addControl="Cancel"
    }
    else{
      this.addControl="Add a New Event"
    }
  }
  getAllEvents(){
    this.eventsService.getAllevents().subscribe(
      posts=>{
        console.log('hi,there,getall',posts)
        this.events=posts
        if(posts.length!=0){
          this.deleteFlag=true
        }
      }
    )
  }

  addNewEvents(){
    this.eventsService.addNewEvent(this.event.title,this.event.price,this.event.sTime,this.event.eTime,
      // this.event.bEmail,this.event.bName,this.event.bPhone,
      this.event.city,this.event.postCode,this.event.street,
      this.event.description).subscribe(()=>{
        this.getAllEvents()
      })
  }

  addEvent(){
    this.addFlag=!this.addFlag
    this.changeAddControl()
  }

  onSubmit(){
    var now = new Date().toISOString();
    now=now.slice(0,17)
    now=now+'60Z'
    if(this.signupForm.value.eventData.title==''||
    this.signupForm.value.eventData.description==''||
    this.signupForm.value.eventData.price==''||
    this.signupForm.value.eventData.sTime==''||
    this.signupForm.value.eventData.ssTime==''||
    this.signupForm.value.eventData.eTime==''||
    this.signupForm.value.eventData.eeTime==''||
    this.signupForm.value.eventData.city==''||
    this.signupForm.value.eventData.postCode==''||
    this.signupForm.value.eventData.street==''
    ){
      alert("The above information is required")
    }
    else if(this.signupForm.value.eventData.sTime+'T'+this.signupForm.value.eventData.ssTime+':30'+'Z'<now){
      alert('This event cannot start before the current time')
    }
    else if(this.signupForm.value.eventData.eTime<this.signupForm.value.eventData.sTime){
      alert("The end time cannot be earlier than the start time!")
    }
    else if(this.signupForm.value.eventData.eTime==this.signupForm.value.eventData.sTime){
      if(this.signupForm.value.eventData.eeTime<this.signupForm.value.eventData.ssTime)
      {
        alert("The end time cannot be earlier than the start time!")
      }
    }
    else{
      console.log('no time issues')
      this.event.title = this.signupForm.value.eventData.title;
      this.event.description = this.signupForm.value.eventData.description;
      this.event.price = this.signupForm.value.eventData.price;
  
      // this.event.bEmail = this.signupForm.value.eventData.bEmail;
      // this.event.bName = this.signupForm.value.eventData.bName;
      // this.event.bPhone = this.signupForm.value.eventData.bPhone;
      
      this.event.sTime = this.signupForm.value.eventData.sTime+'T'+this.signupForm.value.eventData.ssTime+':30'+'Z';
      this.event.eTime = this.signupForm.value.eventData.eTime+'T'+this.signupForm.value.eventData.eeTime+':30'+'Z';
  
      this.event.city = this.signupForm.value.eventData.city;
      this.event.postCode = this.signupForm.value.eventData.postCode;
      this.event.street = this.signupForm.value.eventData.street;
  
      console.log('here',this.event.sTime)
      this.addNewEvents()
      this.signupForm.reset();
      this.addEvent()
    }
  }

  deleteAll(){
    this.eventsService.deleteAll().subscribe(()=>{
      this.events=[]
      this.deleteFlag=false
    })
    alert('Delete Successfully')
    this.deleteConfirm()
    console.log(this.deleteFlag)
  }

  deleteConfirm(){
    this.deleteConfirmFlag=!this.deleteConfirmFlag
    this.deleteFlag=!this.deleteFlag
  }
}
