import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomPaymentComponent } from './room-payment.component';

describe('RoomPaymentComponent', () => {
  let component: RoomPaymentComponent;
  let fixture: ComponentFixture<RoomPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
