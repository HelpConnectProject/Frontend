import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aboutorganization } from './aboutorganization';

describe('Aboutorganization', () => {
  let component: Aboutorganization;
  let fixture: ComponentFixture<Aboutorganization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aboutorganization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aboutorganization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
