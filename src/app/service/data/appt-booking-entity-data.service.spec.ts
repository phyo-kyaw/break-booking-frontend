import { TestBed } from '@angular/core/testing';

import { ApptBookingEntityDataService } from './appt-booking-entity-data.service';

describe('BookingEntityDataService', () => {
  let service: ApptBookingEntityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApptBookingEntityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
