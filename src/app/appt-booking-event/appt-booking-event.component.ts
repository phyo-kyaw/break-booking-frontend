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

// import { DatePipe } from '@angular/common';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

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

  eventsS: Event[];

  // eventS={
  //   title:'',
  //   description:'',
  //   startTime:'',
  //   endTime:'',
  //   location.city:'',
  //   location.postCode:"",
  //   street:'',
  //   price:0,
  // }

  // actions: CalendarEventAction[] = [
  //   {
  //     label: '<i class="fas fa-fw fa-pencil-alt"></i>',
  //     a11yLabel: 'Edit',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       this.handleEvent('Edited', event);
  //     },
  //   },
  //   {
  //     label: '<i class="fas fa-fw fa-trash-alt"></i>',
  //     a11yLabel: 'Delete',
  //     onClick: ({ event }: { event: CalendarEvent }): void => {
  //       console.log('delete',event)
  //     },
  //   },
  // ];

  refresh: Subject<any> = new Subject();

  // events: CalendarEvent[] = [
  //   {
  //     start: subDays(startOfDay(new Date()), 1),
  //     end: addDays(new Date(), 1),
  //     title: 'A 3 day event',
  //     color: colors.red,
  //     actions: this.actions,
  //     allDay: true,
  //     resizable: {
  //       beforeStart: true,
  //       afterEnd: true,
  //     },
  //     draggable: true,
  //   },
  // ];
  events=[]

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal,private http: HttpClient, private eventsService:EventsService) {}

  ngOnInit(): void {
    this.getAllEvents()
  }

  getAllEvents(){
    this.eventsService.getAllevents().subscribe(
      posts=>{
        console.log('hi,there,getall',posts)
        this.events=posts
        // if(posts.length!=0){
        //   this.deleteFlag=true
        // }
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
    this.events = [
      ...this.events,
      {
        description: "Description",
        // eid: string,
        endTime: "No",
        location: {
          city: "City",
          postCode:"PostCode",
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
    this.eventsService.addNewEvent(event.title,event.price,event.startTime,event.endTime,
      // this.event.bEmail,this.event.bName,this.event.bPhone,
      event.location.city,event.location.postCode,event.location.street,
      event.description).subscribe(()=>{
        this.getAllEvents()
      })
  }

  //delete
  deleteEvent(event) {
    console.log('hi Delete',event)
    // this.events = this.events.filter((event) => event !== eventToDelete);
    this.eventsService.deleteEvent(event.eid).subscribe(()=>{
      this.getAllEvents()
    })
  }

  modifyEvent(event){
    console.log('hi modify',event)
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
}
