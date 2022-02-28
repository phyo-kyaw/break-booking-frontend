import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEventFormComponent } from './book-event-form.component';

describe('BookEventFormComponent', () => {
  let component: BookEventFormComponent;
  let fixture: ComponentFixture<BookEventFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookEventFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookEventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
