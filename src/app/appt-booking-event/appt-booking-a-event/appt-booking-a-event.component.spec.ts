import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptBookingAEventComponent } from './appt-booking-a-event.component';

describe('ApptBookingAEventComponent', () => {
  let component: ApptBookingAEventComponent;
  let fixture: ComponentFixture<ApptBookingAEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptBookingAEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptBookingAEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
