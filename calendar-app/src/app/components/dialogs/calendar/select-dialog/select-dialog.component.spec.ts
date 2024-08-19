import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCalendarDialogComponent } from './select-dialog.component';

describe('EditDialogComponent', () => {
  let component: SelectCalendarDialogComponent;
  let fixture: ComponentFixture<SelectCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectCalendarDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
