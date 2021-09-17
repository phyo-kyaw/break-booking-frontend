import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';

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
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  detail=true
  // eventsS: Event[];

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log('delete',event)
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];

  DataEvents=[]

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal,private http: HttpClient, private eventsService:EventsService) {}

  ngOnInit(): void {
    this.getAllEvents()
  }

  getAllEvents(){
    this.eventsService.getAllevents().subscribe(
      posts=>{
        console.log('hi,there,getall',posts)
        this.DataEvents=posts
        this.events=[]
        for (let i = 0; i < this.DataEvents.length; i++) {
          console.log('hi',i)
          this.events = [
            ...this.events,
            {
              title: this.DataEvents[i].title,
              start: startOfDay(new Date(this.DataEvents[i].startTime)),
              end: endOfDay(new Date(this.DataEvents[i].endTime)),
              // color: colors.red,
              draggable: true,
              resizable: {
                beforeStart: true,
                afterEnd: true,
              },
            },
          ];
        }
        console.log('add1111',this.events)
      }
    )
  }

  // 月中点击天
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  //显示日历的部分
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  // 点击日历中某天发生的事件
  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  // add
  addEvent(): void {
    this.DataEvents = [
      ...this.DataEvents,
      {
        description: "Description", 
        endTime: "No",
        location: {
          city: "City",
          postCode:1234,
          street: "Street"
        },
        price: 0,
        startTime:"No",
        title: "New Event",
        add:true
      },
    ];
  }
  addEventConfirm(event){
    console.log('Add',event)
    console.log('aasdsadsa',event.startTime)
    if(event.startTime>event.endTime){
      alert("The end time cannot be earlier than the start time!")
      return
    }
    if(event.title==""){
      alert("Event Title cannot be empty!")
      return
    }
    let start,startM,startD,startH,startMi
    let end,endM,endD,endH,endMi
    if((event.startTime.getMonth()+1)<10){
      startM='0'+(event.startTime.getMonth()+1)
    }
    else{
      startM=event.startTime.getMonth()+1
    }
    if((event.startTime.getDate())<10){
      startD='0'+(event.startTime.getDate())
    }
    else{
      startD=event.startTime.getDate()
    }
    if((event.startTime.getHours())<10){
      startH='0'+(event.startTime.getHours())
    }
    else{
      startH=event.startTime.getHours()
    }
    if((event.startTime.getMinutes())<10){
      startMi='0'+(event.startTime.getMinutes())
    }
    else{
      startMi=event.startTime.getMinutes()
    }
    start=event.startTime.getFullYear()+'-'+startM+'-'+startD+'T'+startH+':'+startD+':30'

    if((event.endTime.getMonth()+1)<10){
      endM='0'+(event.endTime.getMonth()+1)
    }
    else{
      endM=event.endTime.getMonth()+1
    }
    if((event.endTime.getDate())<10){
      endD='0'+(event.endTime.getDate())
    }
    else{
      endD=event.endTime.getDate()
    }
    if((event.endTime.getHours())<10){
      endH='0'+(event.endTime.getHours())
    }
    else{
      endH=event.endTime.getHours()
    }
    if((event.endTime.getMinutes())<10){
      endMi='0'+(event.endTime.getMinutes())
    }
    else{
      endMi=event.endTime.getMinutes()
    }
    end=event.endTime.getFullYear()+'-'+endM+'-'+endD+'T'+endH+':'+endMi+':30'
    this.eventsService.addNewEvent(event.title,event.price,start,end,
      // this.event.bEmail,this.event.bName,this.event.bPhone,
      event.location.city,event.location.postCode,event.location.street,
      event.description).subscribe(()=>{
        this.getAllEvents()
      })
  }

  //delete
  deleteEvent(event,eventToDelete: CalendarEvent) {
    console.log('hi Delete',event)
    this.eventsService.deleteEvent(event.eid).subscribe(()=>{
      this.getAllEvents()
    })
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  modifyEvent(event){
    console.log('hi modify',event)
    if(event.startTime>event.endTime){
      alert("The end time cannot be earlier than the start time!")
      this.getAllEvents()
      return
    }
    this.eventsService.modifyEvent(event.eid,event.title,event.price,event.startTime,event.endTime,
      // this.event.bEmail,this.event.bName,this.event.bPhone,
      event.location.city,event.location.postCode,event.location.street,
      event.description).subscribe(()=>{
        this.getAllEvents()
      })
  }

  deleteAllEvents(){
    this.eventsService.deleteAll().subscribe(()=>{
      this.getAllEvents()
    })
    alert('Delete Successfully')
  }

  // 看是month/day/year
  setView(view: CalendarView) {
    this.view = view;
  }

  // previous/today/next 
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  showDetail(){
    this.detail=!this.detail
    console.log('aaa',this.detail)
  }
}
