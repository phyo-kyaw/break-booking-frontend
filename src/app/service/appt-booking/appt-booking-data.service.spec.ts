import { TestBed } from '@angular/core/testing';

import { ApptBookingDataService } from './appt-booking-data.service';

describe('BookingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApptBookingDataService = TestBed.get(ApptBookingDataService);
    expect(service).toBeTruthy();
  });
});
