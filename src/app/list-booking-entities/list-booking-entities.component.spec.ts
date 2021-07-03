import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBookingEntitiesComponent } from './list-booking-entities.component';

describe('ListBookingEntitiesComponent', () => {
  let component: ListBookingEntitiesComponent;
  let fixture: ComponentFixture<ListBookingEntitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBookingEntitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListBookingEntitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
