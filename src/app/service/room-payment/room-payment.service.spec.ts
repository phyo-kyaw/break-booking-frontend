import { TestBed } from '@angular/core/testing';

import { RoomPaymentService } from './room-payment.service';

describe('RoomPaymentService', () => {
  let service: RoomPaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomPaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
