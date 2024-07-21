import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCalendarDialogComponent } from './edit-dialog.component';

describe('EditDialogComponent', () => {
  let component: EditCalendarDialogComponent;
  let fixture: ComponentFixture<EditCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCalendarDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
