import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceInfoLeftsideComponent } from './device-info-leftside.component';

describe('DeviceInfoLeftsideComponent', () => {
  let component: DeviceInfoLeftsideComponent;
  let fixture: ComponentFixture<DeviceInfoLeftsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceInfoLeftsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceInfoLeftsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
