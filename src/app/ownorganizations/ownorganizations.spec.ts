import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ownorganizations } from './ownorganizations';

describe('Ownorganizations', () => {
  let component: Ownorganizations;
  let fixture: ComponentFixture<Ownorganizations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ownorganizations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ownorganizations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
