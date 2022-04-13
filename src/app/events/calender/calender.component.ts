import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';

import { Event, Booking } from '../Types/event';
import { EventBookingService } from '../../service/event-booking/event-booking.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  encapsulation: ViewEncapsulation.None, // hack to get the styles to apply locally

  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  clickedDate: Date;

  detail = true;

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
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent<Event>[] = [];

  bookings: Booking[] = [];

  restoreBookings: Booking[] = [];

  DataEvents: Event[] = [];

  eidList: string[] = [];

  restoreDataEvents: Event[] = [];

  //false: disable Kitchen sink
  activeDayIsOpen: boolean = false;

  isLoggedIn: boolean = false;

  userProfile: any = '';

  userRoles: string[] = [];

  event: Event;

  searchBooking: string = 'All';

  constructor(
    private modal: NgbModal,
    private eventsService: EventBookingService,
    private modalService: NgbModal,
    protected readonly keycloakService: KeycloakService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getAllEvents();
    this.getAllBookings();
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    if (this.isLoggedIn) {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.userRoles = await this.keycloakService.getUserRoles();
    }
  }

  getAllEvents() {
    this.eventsService.getAllevents().subscribe((res: Event[]) => {
      this.DataEvents = [...res];
      this.restoreDataEvents = [...res];
      this.eidList = [...new Set(res.map(event => event.eid))];

      //server response startTime,  endTime while calendar only accepts keyd start, end
      this.events = res.map(event => {
        return {
          title: event.title,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
          price: event.price,
          actions: this.actions,
          draggable: true,
          resizable: {
            beforeStart: true,
            afterEnd: true
          }
        };
      });
    });
  }

  getAllBookings() {
    this.eventsService.getAllBookings().subscribe((res: Booking[]) => {
      this.bookings = res;
      this.restoreBookings = res;
      console.log(res);
    });
  }

  deleteEvent(eid) {
    this.eventsService.deleteEvent(eid).subscribe(() => this.getAllEvents());
  }

  deleteAllBookings() {
    this.eventsService.deleteAllBookings().subscribe(() => {
      this.getAllBookings();
    });
  }

  deleteBooking(id) {
    this.eventsService.deleteBooking(id).subscribe(() => {
      this.getAllBookings();
    });
  }

  // 月中点击天
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.DataEvents = this.restoreDataEvents;
    this.DataEvents = this.DataEvents.filter(e => {
      const day = new Date(e.startTime);
      return (
        day.getDate() === date.getDate() &&
        day.getFullYear() === date.getFullYear() &&
        day.getMonth() === date.getMonth()
      );
    });
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

  deleteAllEvents() {
    this.eventsService.deleteAll().subscribe(() => {
      this.getAllEvents();
    });
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
    if (item !== null) {
      this.event = this.DataEvents[item];
    }

    this.modalService.open(content, {
      size: 'lg',
      centered: true,
      backdrop: 'static'
    });
  }

  closeModel(): void {
    this.event = null;
  }

  restoreData() {
    this.DataEvents = this.restoreDataEvents;
  }

  searchBookingByEid() {
    this.bookings = this.restoreBookings;
    if (this.searchBooking !== 'All') {
      this.bookings = this.bookings.filter(
        book => book.eventEid === this.searchBooking
      );
    }
  }
}
