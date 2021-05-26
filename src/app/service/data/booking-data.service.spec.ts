import { TestBed } from '@angular/core/testing';

import { BookingDataService } from './booking-data.service';

describe('BookingDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BookingDataService = TestBed.get(BookingDataService);
    expect(service).toBeTruthy();
  });
});
