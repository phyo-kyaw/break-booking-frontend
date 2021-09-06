import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptBookingEventComponent } from './appt-booking-event.component';

describe('ApptBookingEventComponent', () => {
  let component: ApptBookingEventComponent;
  let fixture: ComponentFixture<ApptBookingEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptBookingEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptBookingEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
