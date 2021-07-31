import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptBookingAdminComponent } from './appt-booking-admin.component';

describe('BookingAdminComponent', () => {
  let component: ApptBookingAdminComponent;
  let fixture: ComponentFixture<ApptBookingAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApptBookingAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptBookingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
