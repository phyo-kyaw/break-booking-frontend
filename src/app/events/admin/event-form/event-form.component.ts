import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from '../../Types/event';
import { ViewportScroller } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventBookingService } from '../../../service/event-booking/event-booking.service';
import { ToastService } from 'app/service/toast/toast-service.service';
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
    private eventsService: EventBookingService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.event = { ...this._defaultEvent, ...(this.event ?? {}) };
  }

  onSubmit(event) {
    this.eventsService.addNewEvent(event.form.value).subscribe(
      () => this.showSuccess('Successfully create an new event'),
      () => this.showDanger('Failed to create a new event')
    );
    this.modalService.dismissAll();
  }

  showSuccess(content) {
    this.toastService.show(content, {
      classname: 'bg-success text-light',
      delay: 5000
    });
  }

  showDanger(content) {
    this.toastService.show(content, {
      classname: 'bg-danger text-light',
      delay: 5000
    });
  }
}
