import { TestBed } from '@angular/core/testing';

import { RoomBookingService } from './room-booking.service';

describe('RoomBookingService', () => {
  let service: RoomBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoomBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
