import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticOrderComponent } from './static-order.component';

describe('StaticOrderComponent', () => {
  let component: StaticOrderComponent;
  let fixture: ComponentFixture<StaticOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaticOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
