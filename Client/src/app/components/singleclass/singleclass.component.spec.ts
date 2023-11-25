import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleclassComponent } from './singleclass.component';

describe('SingleclassComponent', () => {
  let component: SingleclassComponent;
  let fixture: ComponentFixture<SingleclassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleclassComponent]
    });
    fixture = TestBed.createComponent(SingleclassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
