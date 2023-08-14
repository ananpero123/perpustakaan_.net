import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EksploreComponent } from './eksplore.component';

describe('EksploreComponent', () => {
  let component: EksploreComponent;
  let fixture: ComponentFixture<EksploreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EksploreComponent]
    });
    fixture = TestBed.createComponent(EksploreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
