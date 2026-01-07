import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ownevents } from './ownevents';

describe('Ownevents', () => {
  let component: Ownevents;
  let fixture: ComponentFixture<Ownevents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ownevents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ownevents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
