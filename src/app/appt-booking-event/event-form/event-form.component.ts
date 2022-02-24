import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Event } from '../event.model';
import { ViewportScroller } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.event = { ...this._defaultEvent, ...(this.event ?? {}) };
    // console.log(this.event);
  }

  onSubmit(event) {
    console.log('valid?', event.valid);
    console.log('event?', event.form.value);
    if (event.valid) {
      console.log('valid');
    } else {
    }
    this.modalService.dismissAll();
  }
}
