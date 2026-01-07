import { TestBed } from '@angular/core/testing';

import { Eventapi } from './eventapi';

describe('Eventapi', () => {
  let service: Eventapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Eventapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
