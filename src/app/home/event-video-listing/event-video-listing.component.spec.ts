import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventVideoListingComponent } from './event-video-listing.component';

describe('EventVideoListingComponent', () => {
  let component: EventVideoListingComponent;
  let fixture: ComponentFixture<EventVideoListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventVideoListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventVideoListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
