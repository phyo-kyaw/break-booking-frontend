import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEntityComponent } from './booking-entity.component';

describe('BookingEntityComponent', () => {
  let component: BookingEntityComponent;
  let fixture: ComponentFixture<BookingEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
