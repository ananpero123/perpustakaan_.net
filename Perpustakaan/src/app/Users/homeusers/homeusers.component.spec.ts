import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeusersComponent } from './homeusers.component';

describe('HomeusersComponent', () => {
  let component: HomeusersComponent;
  let fixture: ComponentFixture<HomeusersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeusersComponent]
    });
    fixture = TestBed.createComponent(HomeusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
