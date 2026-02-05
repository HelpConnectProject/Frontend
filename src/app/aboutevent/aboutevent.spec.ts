import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutevent } from './aboutevent';

describe('Aboutevent', () => {
  let component: Aboutevent;
  let fixture: ComponentFixture<Aboutevent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aboutevent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aboutevent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
