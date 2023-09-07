import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarykuComponent } from './libraryku.component';

describe('LibrarykuComponent', () => {
  let component: LibrarykuComponent;
  let fixture: ComponentFixture<LibrarykuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrarykuComponent]
    });
    fixture = TestBed.createComponent(LibrarykuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
