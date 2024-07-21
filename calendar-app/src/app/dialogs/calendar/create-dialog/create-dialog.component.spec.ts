import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCalendarDialogComponent } from './create-dialog.component';

describe('CreateDialogComponent', () => {
  let component: CreateCalendarDialogComponent;
  let fixture: ComponentFixture<CreateCalendarDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCalendarDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCalendarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
