import { TestBed } from '@angular/core/testing';

import { StaticOrderService } from './static-order.service';

describe('StaticOrderService', () => {
  let service: StaticOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
