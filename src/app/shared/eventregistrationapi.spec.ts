import { TestBed } from '@angular/core/testing';

import { Eventregistrationapi } from './eventregistrationapi';

describe('Eventregistrationapi', () => {
  let service: Eventregistrationapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Eventregistrationapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
