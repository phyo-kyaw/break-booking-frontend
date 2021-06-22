import { TestBed } from '@angular/core/testing';

import { BookingEntityDataService } from './booking-entity-data.service';

describe('BookingEntityDataService', () => {
  let service: BookingEntityDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingEntityDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
