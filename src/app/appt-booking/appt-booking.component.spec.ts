import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApptBookingComponent } from './appt-booking.component';

describe('ApptBookingComponent', () => {
  let component: ApptBookingComponent;
  let fixture: ComponentFixture<ApptBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApptBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApptBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
