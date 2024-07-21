import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEventDialogComponent } from './delete-dialog.component';

describe('DeleteDialogComponent', () => {
  let component: DeleteEventDialogComponent;
  let fixture: ComponentFixture<DeleteEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteEventDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
