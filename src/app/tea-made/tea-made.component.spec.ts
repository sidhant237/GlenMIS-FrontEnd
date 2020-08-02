import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeaMadeComponent } from './tea-made.component';

describe('TeaMadeComponent', () => {
  let component: TeaMadeComponent;
  let fixture: ComponentFixture<TeaMadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeaMadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeaMadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
