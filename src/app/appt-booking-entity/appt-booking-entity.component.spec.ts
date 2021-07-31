import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptBookingEntityComponent } from './appt-booking-entity.component';

describe('BookingEntityComponent', () => {
  let component: ApptBookingEntityComponent;
  let fixture: ComponentFixture<ApptBookingEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptBookingEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptBookingEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
