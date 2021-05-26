import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSelComponent } from './calendar-sel.component';

describe('CalendarSelComponent', () => {
  let component: CalendarSelComponent;
  let fixture: ComponentFixture<CalendarSelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
