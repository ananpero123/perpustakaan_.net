import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveBookComponent } from './save-book.component';

describe('SaveBookComponent', () => {
  let component: SaveBookComponent;
  let fixture: ComponentFixture<SaveBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaveBookComponent]
    });
    fixture = TestBed.createComponent(SaveBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
