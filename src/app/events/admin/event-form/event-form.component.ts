import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from '../../Types/event';
import { ViewportScroller } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBookingService } from '../../../service/event-booking/event-booking.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  private _defaultEvent: Event = {
    description: '',
    endTime: '',
    location: {
      city: '',
      postCode: '',
      street: ''
    },
    price: 0,
    startTime: '',
    title: ''
  };

  @Input() event: Event;

  constructor(
    private modalService: NgbModal,
    private eventsService: EventBookingService
  ) {}

  ngOnInit(): void {
    this.event = { ...this._defaultEvent, ...(this.event ?? {}) };
  }

  onSubmit(event) {
    this.eventsService
      .addNewEvent(event.form.value)
      .subscribe(res => console.log(res));
    this.modalService.dismissAll();
  }
}
