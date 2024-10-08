import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEventDialogComponent } from './edit-dialog.component';

describe('EditDialogComponent', () => {
  let component: EditEventDialogComponent;
  let fixture: ComponentFixture<EditEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEventDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
