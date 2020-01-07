import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceEventsListingComponent } from './device-events-listing.component';

describe('DeviceEventsListingComponent', () => {
  let component: DeviceEventsListingComponent;
  let fixture: ComponentFixture<DeviceEventsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceEventsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceEventsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
