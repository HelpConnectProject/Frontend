import { TestBed } from '@angular/core/testing';

import { Memberapi } from './memberapi';

describe('Memberapi', () => {
  let service: Memberapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Memberapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
