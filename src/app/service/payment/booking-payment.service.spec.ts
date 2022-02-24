import { TestBed } from '@angular/core/testing';

import { BookingPaymentService } from './booking-payment.service';

describe('BookingPaymentService', () => {
  let service: BookingPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
