import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillCutComponent } from './still-cut.component';

describe('StillCutComponent', () => {
  let component: StillCutComponent;
  let fixture: ComponentFixture<StillCutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StillCutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillCutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
