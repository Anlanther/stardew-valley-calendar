import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateYearDialogComponent } from './update-year-dialog.component';

describe('UpdateYearDialogComponent', () => {
  let component: UpdateYearDialogComponent;
  let fixture: ComponentFixture<UpdateYearDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateYearDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateYearDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
