import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { HttpClient } from '@angular/common/http';

import { Event } from './event.model';
import { EventsService } from './event.service';
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

  detail = true;
  // eventsS: Event[];

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log('delete', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent<Event>[] = [];

  DataEvents = [];

  lenEvent = false;

  activeDayIsOpen: boolean = true;

  event: Event;

  constructor(
    private modal: NgbModal,
    private http: HttpClient,
    private eventsService: EventsService,
    private modalService: NgbModal // private modalRef: NgbModalRef
  ) {}

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents() {
    // this.eventsService.getAllevents().subscribe(posts => {
    //   console.log('hi,there,getall', posts);
    //   this.DataEvents = posts;
    //   this.events = [];
    //   if (this.DataEvents.length == 0) {
    //     this.lenEvent = true;
    //   }
    //   for (let i = 0; i < this.DataEvents.length; i++) {
    //     console.log('hi', i);
    //     this.events = [
    //       ...this.events,
    //       {
    //         title: this.DataEvents[i].title,
    //         start: startOfDay(new Date(this.DataEvents[i].startTime)),
    //         end: endOfDay(new Date(this.DataEvents[i].endTime)),
    //         // color: colors.red,
    //         draggable: true,
    //         resizable: {
    //           beforeStart: true,
    //           afterEnd: true
    //         }
    //       }
    //     ];
    //   }
    //   console.log('add1111', this.events);
    // });
    this.events = [
      {
        title: 'Event1',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        // color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true
        }
      }
    ];
    this.DataEvents = [
      {
        title: 'Event1',
        startTime: startOfDay(new Date()),
        endTime: endOfDay(new Date()),
        // color: colors.red,
        description: 'Good event1 description'
      },
      {
        title: 'Event2',
        startTime: startOfDay(new Date()),
        endTime: endOfDay(new Date()),
        // color: colors.red,
        description: 'Good event2 description'
      }
    ];
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
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
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
        description: 'Description',
        endTime: 'No',
        location: {
          city: 'City',
          postCode: 1234,
          street: 'Street'
        },
        price: 0,
        startTime: 'No',
        title: 'New Event',
        add: true
      }
    ];
    this.lenEvent = false;
  }

  deleteAllEvents() {
    this.eventsService.deleteAll().subscribe(() => {
      this.getAllEvents();
    });
    alert('Delete Successfully');
  }

  // 看是month/day/year
  setView(view: CalendarView) {
    this.view = view;
  }

  // previous/today/next
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  showDetail() {
    this.detail = !this.detail;
    console.log('aaa', this.detail);
  }

  open(content, item = null) {
    let option = { ariaLabelledBy: 'New Event', size: 'lg', centered: true };

    if (item !== null) {
      option.ariaLabelledBy = 'Edit Event';
      this.event = this.DataEvents[item];
    }
    this.modalService.open(content, option);
  }

  closeModel(): void {
    this.event = null;
  }
}
