import { TestBed } from '@angular/core/testing';

import { Organizationapi } from './organizationapi';

describe('Organizationapi', () => {
  let service: Organizationapi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Organizationapi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
