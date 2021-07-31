import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApptBookingEntityComponent } from './list-appt-booking-entity.component';

describe('ListBookingEntitiesComponent', () => {
  let component: ListApptBookingEntityComponent;
  let fixture: ComponentFixture<ListApptBookingEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListApptBookingEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListApptBookingEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
